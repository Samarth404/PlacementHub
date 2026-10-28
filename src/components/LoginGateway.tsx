import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  UserCheck,
  KeyRound,
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import { StudentProfile } from '../types/placement';

export interface AuthSession {
  role: 'student' | 'officer';
  authMethod: 'google' | 'credentials';
  uid: string;
  email: string;
  displayName: string;
  usn?: string;
}

interface LoginGatewayProps {
  studentsList: StudentProfile[];
  onGoogleLogin: (targetRole: 'student' | 'officer') => Promise<void>;
  onCredentialLogin: (session: AuthSession, matchedStudent?: StudentProfile) => void;
  authError: string | null;
  isSigningIn: boolean;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  studentsList,
  onGoogleLogin,
  onCredentialLogin,
  authError,
  isSigningIn,
}) => {
  const [portalMode, setPortalMode] = useState<'student' | 'officer'>('student');
  const [identifier, setIdentifier] = useState('1RV21CS042');
  const [password, setPassword] = useState('STU2026');
  const [localError, setLocalError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handlePortalSwitch = (mode: 'student' | 'officer') => {
    setPortalMode(mode);
    setLocalError(null);
    if (mode === 'student') {
      setIdentifier('1RV21CS042');
      setPassword('STU2026');
    } else {
      setIdentifier('admin@rvce.edu.in');
      setPassword('TPO-ADMIN-2026');
    }
  };

  const handleCopyCredential = (idVal: string, passVal: string, keyName: string) => {
    setIdentifier(idVal);
    setPassword(passVal);
    setCopiedKey(keyName);
    setLocalError(null);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (portalMode === 'officer') {
      if (
        (cleanId.toLowerCase() === 'admin@rvce.edu.in' ||
          cleanId.toLowerCase() === 'tpo@rvce.edu.in' ||
          cleanId.toLowerCase() === 'samarthangadi0@gmail.com') &&
        cleanPass === 'TPO-ADMIN-2026'
      ) {
        onCredentialLogin({
          role: 'officer',
          authMethod: 'credentials',
          uid: 'tpo-admin-officer',
          email: cleanId.toLowerCase(),
          displayName: 'Dr. R. Subramanya (Chief TPO)',
        });
        return;
      }
      setLocalError('Invalid TPO Admin credentials. Use the verified officer email and passcode.');
      return;
    }

    // Student authentication check
    const matchedStudent = studentsList.find(
      s =>
        s.usn.toLowerCase() === cleanId.toLowerCase() ||
        s.email.toLowerCase() === cleanId.toLowerCase()
    );

    if (matchedStudent && cleanPass === 'STU2026') {
      onCredentialLogin(
        {
          role: 'student',
          authMethod: 'credentials',
          uid: matchedStudent.id,
          email: matchedStudent.email,
          displayName: matchedStudent.name,
          usn: matchedStudent.usn,
        },
        matchedStudent
      );
      return;
    }

    setLocalError('Invalid Student USN/Email or PIN. Click a credential card below to autofill.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Security Bar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              CampusPlace
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Role-Based Access Control · Firebase Security</span>
          </div>
        </div>
      </header>

      {/* Main Content Split */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Authentication Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div className="space-y-6">
              {/* Role Portal Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handlePortalSwitch('student')}
                  className={`py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    portalMode === 'student'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Student Login Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePortalSwitch('officer')}
                  className={`py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    portalMode === 'officer'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>TPO Admin Login</span>
                </button>
              </div>

              {/* Heading */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {portalMode === 'student'
                    ? 'Sign in to Student Placement Portal'
                    : 'Sign in to TPO Administration Console'}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {portalMode === 'student'
                    ? 'Access your personalized eligibility engine, live stage tracker, and deadline reminders.'
                    : 'Authorized Training & Placement Cell access for drive broadcasting, stage audits, and PII-protected rosters.'}
                </p>
              </div>

              {/* Error Banner */}
              {(localError || authError) && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{localError || authError}</span>
                </div>
              )}

              {/* Primary Google Auth Button */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isSigningIn}
                  onClick={() => onGoogleLogin(portalMode)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors shadow-2xs disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>
                    {isSigningIn
                      ? 'Authenticating with Firebase...'
                      : `Continue with Google (${portalMode === 'student' ? 'Student Account' : 'TPO Officer'})`}
                  </span>
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  Backed by Firebase Authentication &amp; Cloud Firestore persistence
                </p>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-[11px] font-medium text-slate-400">
                  OR SIGN IN WITH CAMPUS CREDENTIALS
                </span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* Campus Credentials Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {portalMode === 'student'
                      ? 'University Seat Number (USN) or College Email'
                      : 'TPO Administrator Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder={
                        portalMode === 'student'
                          ? 'e.g. 1RV21CS042 or ananya.cs21@rvce.edu.in'
                          : 'admin@rvce.edu.in'
                      }
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono-numbers"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {portalMode === 'student' ? 'Student Security PIN' : 'Admin Security Passcode'}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono-numbers"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors shadow-xs ${
                    portalMode === 'student'
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  <span>
                    {portalMode === 'student'
                      ? 'Unlock Student Dashboard'
                      : 'Unlock TPO Admin Console'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Zero-Trust Session Isolation</span>
              <span>Separate Role Dashboards</span>
            </div>
          </div>

          {/* Right Column: Ready-to-Use Demo Credentials Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Pre-Configured Login Credentials
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any credential card below to autofill and test different student eligibility tiers or the dedicated Admin Console.
                </p>
              </div>

              {/* Student Demo Accounts */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Student Portal Accounts (PIN: STU2026)
                </p>

                {studentsList.map(stu => {
                  const isCopied = copiedKey === stu.id;
                  return (
                    <div
                      key={stu.id}
                      onClick={() => {
                        setPortalMode('student');
                        handleCopyCredential(stu.usn, 'STU2026', stu.id);
                      }}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                            {stu.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {stu.branch} · CGPA {stu.cgpa.toFixed(2)} · {stu.backlogs} Backlogs
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Filled</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Autofill</span>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono-numbers text-slate-600">
                        <span>USN: <strong>{stu.usn}</strong></span>
                        <span>PIN: <strong>STU2026</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Admin Demo Account */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  TPO Admin Console Credentials
                </p>
                <div
                  onClick={() => {
                    setPortalMode('officer');
                    handleCopyCredential('admin@rvce.edu.in', 'TPO-ADMIN-2026', 'admin-tpo');
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span>Chief Placement Officer (Admin)</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Full Drive Publishing, Candidate Stage Control &amp; PII Masking
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                      {copiedKey === 'admin-tpo' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Filled</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Autofill</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-mono-numbers text-slate-700">
                    <span>ID: <strong>admin@rvce.edu.in</strong></span>
                    <span>Passcode: <strong>TPO-ADMIN-2026</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Isolated Role Architecture</span>
              </div>
              <p>
                Students cannot access the TPO Admin Console, and Admin sessions open directly into the dedicated Placement Officer Command Center.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
