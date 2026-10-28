import React, { useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import {
  db,
  auth,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  mockDrives,
  demoStudents,
  mockApplications,
  mockNotices,
  mockReminders,
} from './data/mockData';
import {
  CompanyDrive,
  StudentProfile,
  ApplicationRecord,
  NoticeItem,
  Reminder,
} from './types/placement';
import { Navbar } from './components/Navbar';
import { StatsRibbon } from './components/StatsRibbon';
import { CentralFeed } from './components/CentralFeed';
import { EligibilityChecker } from './components/EligibilityChecker';
import { PipelineTracker } from './components/PipelineTracker';
import { TPOManager } from './components/TPOManager';
import { RemindersModal } from './components/RemindersModal';
import { DriveDetailModal } from './components/DriveDetailModal';
import { LoginGateway, AuthSession } from './components/LoginGateway';
import { CheckCircle2, AlertCircle, Info, ShieldCheck, UserCheck } from 'lucide-react';

const ADMIN_EMAIL = 'samarthangadi0@gmail.com';

export default function App() {
  // Authentication & Session State
  const [session, setSession] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem('campus_auth_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Application Data State
  const [drives, setDrives] = useState<CompanyDrive[]>(() => {
    const saved = localStorage.getItem('campus_drives');
    return saved ? JSON.parse(saved) : mockDrives;
  });

  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    const saved = localStorage.getItem('campus_applications');
    return saved ? JSON.parse(saved) : mockApplications;
  });

  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    const saved = localStorage.getItem('campus_notices');
    return saved ? JSON.parse(saved) : mockNotices;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('campus_reminders');
    return saved ? JSON.parse(saved) : mockReminders;
  });

  const [studentsList, setStudentsList] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('campus_students');
    return saved ? JSON.parse(saved) : demoStudents;
  });

  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(studentsList[0]);
  const [activeTab, setActiveTab] = useState<string>(() =>
    session?.role === 'officer' ? 'officer' : 'feed'
  );
  const [detailDrive, setDetailDrive] = useState<CompanyDrive | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'warn';
  } | null>(null);

  const showToast = (
    text: string,
    type: 'success' | 'info' | 'warn' = 'success'
  ) => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Persist local state
  useEffect(() => {
    localStorage.setItem('campus_drives', JSON.stringify(drives));
  }, [drives]);

  useEffect(() => {
    localStorage.setItem('campus_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('campus_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('campus_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('campus_students', JSON.stringify(studentsList));
  }, [studentsList]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('campus_auth_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('campus_auth_session');
    }
  }, [session]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async user => {
      setFirebaseUser(user);
      setAuthReady(true);

      if (user) {
        const isUserAdmin = user.email?.toLowerCase() === ADMIN_EMAIL;
        // Load or create StudentProfile in Firestore
        if (!isUserAdmin) {
          const profilePath = `student_profiles/${user.uid}`;
          try {
            const snap = await getDoc(doc(db, 'student_profiles', user.uid));
            if (snap.exists()) {
              const data = snap.data();
              const loadedProfile: StudentProfile = {
                id: user.uid,
                name: data.name || user.displayName || 'Student User',
                usn: data.usn || '1RV21CS099',
                email: data.email || user.email || 'student@rvce.edu.in',
                phone: data.phone || '+91 98765 43210',
                branch: data.branch || 'CSE',
                cgpa: typeof data.cgpa === 'number' ? data.cgpa : 8.5,
                backlogs: typeof data.backlogs === 'number' ? data.backlogs : 0,
                graduationYear: data.graduationYear || 2026,
                resumeUrl: data.resumeUrl || 'https://portfolio.dev/resume.pdf',
              };
              setCurrentStudent(loadedProfile);
            } else {
              const newProfile = {
                uid: user.uid,
                name: (user.displayName || 'Campus Student').slice(0, 100),
                usn: '1RV21CS099',
                email: (user.email || 'student@rvce.edu.in').slice(0, 150),
                phone: '+91 98765 43210',
                branch: 'CSE',
                cgpa: 8.5,
                backlogs: 0,
                graduationYear: 2026,
                resumeUrl: 'https://portfolio.dev/resume.pdf',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              };
              await setDoc(doc(db, 'student_profiles', user.uid), newProfile);
              setCurrentStudent({
                id: user.uid,
                name: newProfile.name,
                usn: newProfile.usn,
                email: newProfile.email,
                phone: newProfile.phone,
                branch: newProfile.branch,
                cgpa: newProfile.cgpa,
                backlogs: newProfile.backlogs,
                graduationYear: newProfile.graduationYear,
                resumeUrl: newProfile.resumeUrl,
              });
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, profilePath);
          }
        }
      }
    });
    return () => unsub();
  }, []);

  // Attach real-time Firestore listeners when authenticated with Firebase Auth
  useEffect(() => {
    if (!authReady || !firebaseUser) return;

    const drivesQuery = query(
      collection(db, 'drives'),
      where('visibility', '==', 'campus')
    );
    const unsubDrives = onSnapshot(
      drivesQuery,
      snapshot => {
        if (!snapshot.empty) {
          const remoteDrives: CompanyDrive[] = snapshot.docs.map(d => {
            const data = d.data();
            return {
              id: d.id,
              companyName: data.companyName,
              role: data.role,
              packageCTC: data.packageCTC,
              numericCTC: data.numericCTC,
              location: data.location,
              deadlineDate: data.deadlineDate,
              driveDate: data.driveDate,
              minCGPA: data.minCGPA,
              eligibleBranches: data.eligibleBranches,
              maxBacklogs: data.maxBacklogs,
              description: data.description,
              rounds: data.rounds,
              source: data.source,
              contactEmail: data.contactEmail,
              status: data.status,
              tags: data.tags,
            };
          });
          setDrives(remoteDrives);
        } else if (firebaseUser.email?.toLowerCase() === ADMIN_EMAIL) {
          // Seed initial drives into Firestore for Admin
          mockDrives.forEach(async drv => {
            try {
              await setDoc(doc(db, 'drives', drv.id), {
                companyName: drv.companyName.slice(0, 100),
                role: drv.role.slice(0, 120),
                packageCTC: drv.packageCTC.slice(0, 40),
                numericCTC: drv.numericCTC,
                location: drv.location.slice(0, 100),
                deadlineDate: drv.deadlineDate.slice(0, 30),
                driveDate: drv.driveDate.slice(0, 30),
                minCGPA: drv.minCGPA,
                eligibleBranches: drv.eligibleBranches.slice(0, 10),
                maxBacklogs: drv.maxBacklogs,
                description: drv.description.slice(0, 1000),
                rounds: drv.rounds.slice(0, 10),
                source: drv.source,
                contactEmail: drv.contactEmail.slice(0, 150),
                status: drv.status,
                tags: drv.tags.slice(0, 8),
                visibility: 'campus',
                createdBy: firebaseUser.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `drives/${drv.id}`);
            }
          });
        }
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, 'drives');
      }
    );

    const noticesQuery = query(
      collection(db, 'notices'),
      where('visibility', '==', 'campus')
    );
    const unsubNotices = onSnapshot(
      noticesQuery,
      snapshot => {
        if (!snapshot.empty) {
          const remoteNotices: NoticeItem[] = snapshot.docs.map(d => {
            const data = d.data();
            return {
              id: d.id,
              title: data.title,
              content: data.content,
              publishedDate: data.publishedDate,
              source: data.source,
              urgent: data.urgent,
              deadline: data.deadline || undefined,
            };
          });
          setNotices(remoteNotices);
        }
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, 'notices');
      }
    );

    const isAdminUser = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL;
    const appsQuery = isAdminUser
      ? query(collection(db, 'applications'), where('visibility', '==', 'campus'))
      : query(
          collection(db, 'applications'),
          where('studentUid', '==', firebaseUser.uid)
        );

    const unsubApps = onSnapshot(
      appsQuery,
      snapshot => {
        if (!snapshot.empty) {
          const remoteApps: ApplicationRecord[] = snapshot.docs.map(d => {
            const data = d.data();
            const roundNames: string[] = data.roundNames || ['Application'];
            const currentIdx: number = data.currentStageIndex || 0;
            return {
              id: d.id,
              driveId: data.driveId,
              companyName: data.companyName,
              role: data.role,
              packageCTC: data.packageCTC,
              studentId: data.studentUid,
              studentUSN: data.studentUSN,
              studentName: data.studentName,
              studentEmail: data.studentEmail,
              studentPhone: data.studentPhone,
              studentBranch: data.studentBranch,
              studentCGPA: data.studentCGPA,
              studentBacklogs: data.studentBacklogs,
              stages: roundNames.map((name, idx) => ({
                stageName: name,
                status:
                  data.overallStatus === 'Offered' || idx < currentIdx
                    ? 'Cleared'
                    : data.overallStatus === 'Rejected' && idx === currentIdx
                    ? 'Not Cleared'
                    : idx === currentIdx
                    ? 'In Progress'
                    : 'Upcoming',
              })),
              currentStageIndex: currentIdx,
              overallStatus: data.overallStatus,
              appliedDate: data.appliedDate,
              lastUpdated: data.lastUpdated,
              offerCTC:
                data.overallStatus === 'Offered' ? data.packageCTC : undefined,
            };
          });
          setApplications(remoteApps);
        }
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, 'applications');
      }
    );

    const remindersQuery = query(
      collection(db, 'reminders'),
      where('ownerUid', '==', firebaseUser.uid)
    );
    const unsubReminders = onSnapshot(
      remindersQuery,
      snapshot => {
        if (!snapshot.empty) {
          const remoteReminders: Reminder[] = snapshot.docs.map(d => {
            const data = d.data();
            return {
              id: d.id,
              title: data.title,
              dueDate: data.dueDate,
              dueTime: data.dueTime,
              type: data.type,
              isCompleted: data.isCompleted,
              notifyMethod: data.notifyMethod,
            };
          });
          setReminders(remoteReminders);
        }
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, 'reminders');
      }
    );

    return () => {
      unsubDrives();
      unsubNotices();
      unsubApps();
      unsubReminders();
    };
  }, [authReady, firebaseUser]);

  // Google Sign-In Handler
  const handleGoogleLogin = async (targetRole: 'student' | 'officer') => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const isVerifiedAdmin = user.email?.toLowerCase() === ADMIN_EMAIL;

      if (targetRole === 'officer' && !isVerifiedAdmin) {
        setAuthError(
          `Google account (${user.email}) is not registered as a Chief Placement Officer. Use Student Portal or sign in with the authorized TPO Admin account.`
        );
        await signOut(auth);
        setIsSigningIn(false);
        return;
      }

      const assignedRole = targetRole === 'officer' && isVerifiedAdmin ? 'officer' : 'student';
      const newSession: AuthSession = {
        role: assignedRole,
        authMethod: 'google',
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Authenticated User',
        usn: assignedRole === 'student' ? '1RV21CS099' : undefined,
      };

      setSession(newSession);
      setActiveTab(assignedRole === 'officer' ? 'officer' : 'feed');
      showToast(
        `Signed in via Google as ${newSession.displayName} (${
          assignedRole === 'officer' ? 'TPO Admin' : 'Student'
        })`,
        'success'
      );
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Google Sign-In failed or was cancelled.'
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  // Campus Credential Login Handler
  const handleCredentialLogin = (
    newSession: AuthSession,
    matchedStudent?: StudentProfile
  ) => {
    setAuthError(null);
    if (matchedStudent) {
      setCurrentStudent(matchedStudent);
    }
    setSession(newSession);
    setActiveTab(newSession.role === 'officer' ? 'officer' : 'feed');
    showToast(
      `Welcome, ${newSession.displayName}! (${
        newSession.role === 'officer' ? 'TPO Admin Console' : 'Student Portal'
      })`,
      'success'
    );
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    if (firebaseUser) {
      await signOut(auth);
    }
    setSession(null);
    setDetailDrive(null);
    showToast('Signed out securely.', 'info');
  };

  // Apply to Drive
  const handleApplyDrive = async (drive: CompanyDrive) => {
    const exists = applications.find(
      a => a.driveId === drive.id && a.studentId === currentStudent.id
    );
    if (exists) {
      showToast(`Already applied to ${drive.companyName}`, 'info');
      setActiveTab('pipeline');
      return;
    }

    const appId = `app-${Date.now().toString().slice(-6)}`;
    const newApp: ApplicationRecord = {
      id: appId,
      driveId: drive.id,
      companyName: drive.companyName,
      role: drive.role,
      packageCTC: drive.packageCTC,
      studentId: currentStudent.id,
      studentUSN: currentStudent.usn,
      studentName: currentStudent.name,
      studentEmail: currentStudent.email,
      studentPhone: currentStudent.phone,
      studentBranch: currentStudent.branch,
      studentCGPA: currentStudent.cgpa,
      studentBacklogs: currentStudent.backlogs,
      stages: drive.rounds.map((roundName, idx) => ({
        stageName: roundName,
        status: idx === 0 ? 'Cleared' : idx === 1 ? 'In Progress' : 'Upcoming',
        scheduledDate: idx === 1 ? '2026-11-06' : undefined,
        notes:
          idx === 1
            ? 'Review fundamental data structures & company practice set.'
            : undefined,
      })),
      currentStageIndex: Math.min(1, drive.rounds.length - 1),
      overallStatus: 'In Progress',
      appliedDate: '2026-10-28',
      lastUpdated: '2026-10-28',
    };

    if (firebaseUser && session?.authMethod === 'google') {
      try {
        await setDoc(doc(db, 'applications', appId), {
          driveId: drive.id.slice(0, 128),
          companyName: drive.companyName.slice(0, 100),
          role: drive.role.slice(0, 120),
          packageCTC: drive.packageCTC.slice(0, 40),
          studentUid: firebaseUser.uid,
          studentUSN: currentStudent.usn.slice(0, 30),
          studentName: currentStudent.name.slice(0, 100),
          studentEmail: currentStudent.email.slice(0, 150),
          studentPhone: currentStudent.phone.slice(0, 25),
          studentBranch: currentStudent.branch.slice(0, 50),
          studentCGPA: currentStudent.cgpa,
          studentBacklogs: currentStudent.backlogs,
          roundNames: drive.rounds.slice(0, 10),
          currentStageIndex: Math.min(1, drive.rounds.length - 1),
          overallStatus: 'In Progress',
          appliedDate: '2026-10-28',
          lastUpdated: '2026-10-28',
          visibility: 'campus',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `applications/${appId}`);
      }
    }

    setApplications(prev => [newApp, ...prev]);
    showToast(`Application submitted for ${drive.companyName}!`, 'success');
    setActiveTab('pipeline');
  };

  // Add Reminder from Drive
  const handleAddReminderFromDrive = async (drive: CompanyDrive) => {
    const remId = `rem-drv-${Date.now().toString().slice(-6)}`;
    const newRem: Reminder = {
      id: remId,
      driveId: drive.id,
      title: `${drive.companyName} Application Deadline`,
      dueDate: drive.deadlineDate,
      dueTime: '11:59 PM',
      type: 'Application Deadline',
      isCompleted: false,
      notifyMethod: 'In-App',
    };

    if (firebaseUser && session?.authMethod === 'google') {
      try {
        await setDoc(doc(db, 'reminders', remId), {
          ownerUid: firebaseUser.uid,
          title: newRem.title.slice(0, 160),
          dueDate: newRem.dueDate.slice(0, 30),
          dueTime: newRem.dueTime.slice(0, 30),
          type: newRem.type,
          isCompleted: false,
          notifyMethod: 'In-App',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `reminders/${remId}`);
      }
    }

    setReminders(prev => [newRem, ...prev]);
    showToast(`Added deadline reminder for ${drive.companyName}`, 'success');
  };

  // Advance Application Stage
  const handleAdvanceStage = async (applicationId: string, nextNotes?: string) => {
    const targetApp = applications.find(a => a.id === applicationId);
    if (!targetApp) return;

    const nextIndex = targetApp.currentStageIndex + 1;
    const isCompleted = nextIndex >= targetApp.stages.length;
    const clampedIndex = Math.min(nextIndex, targetApp.stages.length - 1);
    const nextStatus = isCompleted ? 'Offered' : 'In Progress';

    if (firebaseUser && session?.authMethod === 'google') {
      try {
        await updateDoc(doc(db, 'applications', applicationId), {
          currentStageIndex: clampedIndex,
          overallStatus: nextStatus,
          lastUpdated: '2026-10-28',
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `applications/${applicationId}`);
      }
    }

    setApplications(prev =>
      prev.map(app => {
        if (app.id !== applicationId) return app;
        const updatedStages = app.stages.map((stage, idx) => {
          if (idx === app.currentStageIndex) {
            return { ...stage, status: 'Cleared' as const };
          }
          if (idx === nextIndex) {
            return {
              ...stage,
              status: 'In Progress' as const,
              notes: nextNotes || 'Proceed to technical assessment round.',
            };
          }
          return stage;
        });

        return {
          ...app,
          stages: updatedStages,
          currentStageIndex: clampedIndex,
          overallStatus: nextStatus,
          offerCTC: isCompleted ? app.packageCTC : undefined,
          lastUpdated: '2026-10-28',
        };
      })
    );
    showToast('Candidate advanced to next recruitment round!', 'success');
  };

  // Award Offer
  const handleAwardOffer = async (applicationId: string, ctc: string) => {
    const targetApp = applications.find(a => a.id === applicationId);
    if (!targetApp) return;

    const finalIdx = targetApp.stages.length - 1;
    if (firebaseUser && session?.authMethod === 'google') {
      try {
        await updateDoc(doc(db, 'applications', applicationId), {
          currentStageIndex: finalIdx,
          overallStatus: 'Offered',
          lastUpdated: '2026-10-28',
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `applications/${applicationId}`);
      }
    }

    setApplications(prev =>
      prev.map(app => {
        if (app.id !== applicationId) return app;
        return {
          ...app,
          stages: app.stages.map(s => ({ ...s, status: 'Cleared' as const })),
          currentStageIndex: finalIdx,
          overallStatus: 'Offered',
          offerCTC: ctc,
          lastUpdated: '2026-10-28',
        };
      })
    );
    showToast(`Placement offer officially awarded (${ctc})`, 'success');
  };

  // Reject Application
  const handleRejectApplication = async (applicationId: string) => {
    const targetApp = applications.find(a => a.id === applicationId);
    if (!targetApp) return;

    if (firebaseUser && session?.authMethod === 'google') {
      try {
        await updateDoc(doc(db, 'applications', applicationId), {
          currentStageIndex: targetApp.currentStageIndex,
          overallStatus: 'Rejected',
          lastUpdated: '2026-10-28',
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `applications/${applicationId}`);
      }
    }

    setApplications(prev =>
      prev.map(app => {
        if (app.id !== applicationId) return app;
        return {
          ...app,
          overallStatus: 'Rejected',
          lastUpdated: '2026-10-28',
        };
      })
    );
    showToast('Application marked not shortlisted.', 'warn');
  };

  // Add New Drive (Admin)
  const handleAddNewDrive = async (newDrive: CompanyDrive) => {
    const cleanId = newDrive.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 100);
    const noticeId = `not-${Date.now().toString().slice(-6)}`;

    if (firebaseUser && session?.authMethod === 'google') {
      try {
        await setDoc(doc(db, 'drives', cleanId), {
          companyName: newDrive.companyName.slice(0, 100),
          role: newDrive.role.slice(0, 120),
          packageCTC: newDrive.packageCTC.slice(0, 40),
          numericCTC: newDrive.numericCTC,
          location: newDrive.location.slice(0, 100),
          deadlineDate: newDrive.deadlineDate.slice(0, 30),
          driveDate: newDrive.driveDate.slice(0, 30),
          minCGPA: newDrive.minCGPA,
          eligibleBranches: newDrive.eligibleBranches.slice(0, 10),
          maxBacklogs: newDrive.maxBacklogs,
          description: newDrive.description.slice(0, 1000),
          rounds: newDrive.rounds.slice(0, 10),
          source: newDrive.source,
          contactEmail: newDrive.contactEmail.slice(0, 150),
          status: newDrive.status,
          tags: newDrive.tags.slice(0, 8),
          visibility: 'campus',
          createdBy: firebaseUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await setDoc(doc(db, 'notices', noticeId), {
          title: `New Campus Placement Drive: ${newDrive.companyName} (${newDrive.packageCTC})`.slice(0, 160),
          content: `Applications are open for ${newDrive.role}. Min CGPA: ${newDrive.minCGPA}. Deadline: ${newDrive.deadlineDate}.`.slice(0, 1000),
          publishedDate: '2026-10-28',
          source: newDrive.source,
          urgent: false,
          deadline: newDrive.deadlineDate.slice(0, 30),
          visibility: 'campus',
          createdBy: firebaseUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `drives/${cleanId}`);
      }
    }

    setDrives(prev => [{ ...newDrive, id: cleanId }, ...prev]);
    const newNotice: NoticeItem = {
      id: noticeId,
      driveId: cleanId,
      title: `New Campus Placement Drive: ${newDrive.companyName} (${newDrive.packageCTC})`,
      content: `Applications are open for ${newDrive.role}. Min CGPA: ${newDrive.minCGPA}. Deadline: ${newDrive.deadlineDate}.`,
      publishedDate: '2026-10-28',
      source: newDrive.source,
      urgent: false,
      deadline: newDrive.deadlineDate,
    };
    setNotices(prev => [newNotice, ...prev]);
    showToast(`Published new placement drive: ${newDrive.companyName}!`, 'success');
  };

  // Update Student Profile
  const handleUpdateStudentProfile = async (updated: Partial<StudentProfile>) => {
    const updatedStudent = { ...currentStudent, ...updated };
    setCurrentStudent(updatedStudent);
    setStudentsList(prev =>
      prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
    );

    if (firebaseUser && session?.authMethod === 'google' && session.role === 'student') {
      try {
        await updateDoc(doc(db, 'student_profiles', firebaseUser.uid), {
          name: updatedStudent.name.slice(0, 100),
          usn: updatedStudent.usn.slice(0, 30),
          phone: updatedStudent.phone.slice(0, 25),
          branch: updatedStudent.branch.slice(0, 50),
          cgpa: updatedStudent.cgpa,
          backlogs: updatedStudent.backlogs,
          graduationYear: updatedStudent.graduationYear,
          resumeUrl: updatedStudent.resumeUrl.slice(0, 300),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(
          err,
          OperationType.UPDATE,
          `student_profiles/${firebaseUser.uid}`
        );
      }
    }

    showToast('Student academic parameters updated!', 'success');
  };

  // Reminders CRUD
  const handleToggleReminder = async (id: string) => {
    const target = reminders.find(r => r.id === id);
    if (!target) return;

    if (firebaseUser && session?.authMethod === 'google') {
      try {
        await updateDoc(doc(db, 'reminders', id), {
          title: target.title,
          dueDate: target.dueDate,
          dueTime: target.dueTime,
          type: target.type,
          isCompleted: !target.isCompleted,
          notifyMethod: target.notifyMethod,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `reminders/${id}`);
      }
    }

    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const handleAddCustomReminder = async (rem: Reminder) => {
    const cleanId = rem.id.replace(/[^a-zA-Z0-9_-]/g, '-');
    if (firebaseUser && session?.authMethod === 'google') {
      try {
        await setDoc(doc(db, 'reminders', cleanId), {
          ownerUid: firebaseUser.uid,
          title: rem.title.slice(0, 160),
          dueDate: rem.dueDate.slice(0, 30),
          dueTime: rem.dueTime.slice(0, 30),
          type: rem.type,
          isCompleted: false,
          notifyMethod: rem.notifyMethod,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `reminders/${cleanId}`);
      }
    }

    setReminders(prev => [{ ...rem, id: cleanId }, ...prev]);
    showToast('New reminder created successfully!', 'success');
  };

  const handleDeleteReminder = async (id: string) => {
    if (firebaseUser && session?.authMethod === 'google') {
      try {
        await deleteDoc(doc(db, 'reminders', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `reminders/${id}`);
      }
    }

    setReminders(prev => prev.filter(r => r.id !== id));
    showToast('Reminder deleted', 'info');
  };

  const unreadRemindersCount = reminders.filter(r => !r.isCompleted).length;

  // Gate unauthenticated users with the dedicated Security & Login Gateway
  if (!session) {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs font-medium">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        )}
        <LoginGateway
          studentsList={studentsList}
          onGoogleLogin={handleGoogleLogin}
          onCredentialLogin={handleCredentialLogin}
          authError={authError}
          isSigningIn={isSigningIn}
        />
      </>
    );
  }

  const isOfficer = session.role === 'officer';

  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs font-medium">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : toastMessage.type === 'warn' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navigation Bar (Role-Isolated) */}
      <Navbar
        session={session}
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        currentStudent={currentStudent}
        unreadCount={unreadRemindersCount}
        onSignOut={handleSignOut}
      />

      {/* Contextual Role Identity Strip */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            {isOfficer ? (
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            ) : (
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="font-semibold">
              {isOfficer
                ? `TPO Admin Dashboard · ${session.displayName}`
                : `Student Portal · ${currentStudent.name} (${currentStudent.usn})`}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 font-mono-numbers">
              {isOfficer
                ? `Authorized Email: ${session.email}`
                : `${currentStudent.branch} · CGPA ${currentStudent.cgpa.toFixed(2)} · ${currentStudent.backlogs} Backlogs`}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            {session.authMethod === 'google'
              ? 'Firebase Auth + Cloud Firestore Active'
              : 'Verified Campus Session'}
          </div>
        </div>
      </div>

      {/* High-Density Placement Statistics Ribbon */}
      <StatsRibbon
        drives={drives}
        student={currentStudent}
        applications={applications}
        role={session.role}
        onNavigateToTab={tab => setActiveTab(tab)}
      />

      {/* Main View Router (Strictly Partitioned by Role) */}
      <main className="flex-1">
        {isOfficer && activeTab === 'officer' && (
          <TPOManager
            drives={drives}
            applications={applications}
            onAddNewDrive={handleAddNewDrive}
            onAdvanceStage={handleAdvanceStage}
            onRejectApplication={handleRejectApplication}
            onAwardOffer={handleAwardOffer}
          />
        )}

        {activeTab === 'feed' && (
          <CentralFeed
            drives={drives}
            student={currentStudent}
            applications={applications}
            notices={notices}
            onApplyDrive={handleApplyDrive}
            onAddReminder={handleAddReminderFromDrive}
            onOpenDetails={drv => setDetailDrive(drv)}
            onNavigateToTab={tab => setActiveTab(tab)}
          />
        )}

        {activeTab === 'eligibility' && (
          <EligibilityChecker
            drives={drives}
            student={currentStudent}
            applications={applications}
            onApplyDrive={handleApplyDrive}
            onUpdateStudentProfile={handleUpdateStudentProfile}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineTracker
            applications={applications}
            student={currentStudent}
            role={session.role}
            onAdvanceStage={handleAdvanceStage}
            onRejectApplication={handleRejectApplication}
            onAwardOffer={handleAwardOffer}
            onNavigateToTab={tab => setActiveTab(tab)}
          />
        )}

        {!isOfficer && activeTab === 'reminders' && (
          <RemindersModal
            reminders={reminders}
            drives={drives}
            onToggleComplete={handleToggleReminder}
            onAddReminder={handleAddCustomReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}
      </main>

      {/* Drive Detail & Breakdown Modal */}
      <DriveDetailModal
        drive={detailDrive}
        student={currentStudent}
        applications={applications}
        onClose={() => setDetailDrive(null)}
        onApply={handleApplyDrive}
        onAddReminder={handleAddReminderFromDrive}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <strong>CampusPlace</strong> · Central Placement &amp; Career Development Cell
          </div>
          <div className="flex items-center gap-4">
            <span>Role-Based Access Control</span>
            <span>·</span>
            <span>Firebase Security Rules</span>
            <span>·</span>
            <span>Student Privacy Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
