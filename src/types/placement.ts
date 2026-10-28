export type PlacementSource = 'Email Notice' | 'College Portal' | 'TPO WhatsApp' | 'Careers Site' | 'Official Bulletin';

export interface CompanyDrive {
  id: string;
  companyName: string;
  role: string;
  packageCTC: string; // e.g., "18.5 LPA" or "8 - 12 LPA"
  numericCTC: number; // in LPA for sorting
  location: string;
  deadlineDate: string; // YYYY-MM-DD
  driveDate: string; // YYYY-MM-DD
  minCGPA: number;
  eligibleBranches: string[];
  maxBacklogs: number;
  allowedGender?: 'All' | 'Female Only' | 'Male Only';
  description: string;
  rounds: string[];
  source: PlacementSource;
  registrationLink?: string;
  contactEmail: string;
  status: 'Active' | 'Upcoming' | 'Closed';
  tags: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  usn: string;
  email: string;
  phone: string;
  branch: string;
  cgpa: number;
  backlogs: number;
  graduationYear: number;
  resumeUrl: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export type StageStatus = 'Cleared' | 'In Progress' | 'Upcoming' | 'Not Cleared' | 'Offer Issued';

export interface ApplicationStage {
  stageName: string;
  status: StageStatus;
  scheduledDate?: string;
  scheduledTime?: string;
  meetingLink?: string;
  notes?: string;
  scoreOrFeedback?: string;
}

export interface ApplicationRecord {
  id: string;
  driveId: string;
  companyName: string;
  role: string;
  packageCTC: string;
  studentId: string;
  studentUSN: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentBranch: string;
  studentCGPA: number;
  studentBacklogs: number;
  stages: ApplicationStage[];
  currentStageIndex: number;
  overallStatus: 'Applied' | 'In Progress' | 'Shortlisted' | 'Offered' | 'Rejected';
  appliedDate: string;
  lastUpdated: string;
  offerCTC?: string;
}

export interface NoticeItem {
  id: string;
  driveId?: string;
  title: string;
  content: string;
  publishedDate: string;
  source: PlacementSource;
  urgent: boolean;
  deadline?: string;
  linkText?: string;
  linkUrl?: string;
}

export interface Reminder {
  id: string;
  driveId?: string;
  title: string;
  dueDate: string;
  dueTime: string;
  type: 'Application Deadline' | 'Online Assessment' | 'Technical Interview' | 'HR Round' | 'Document Submission';
  isCompleted: boolean;
  notifyMethod: 'In-App' | 'Calendar Download';
}
