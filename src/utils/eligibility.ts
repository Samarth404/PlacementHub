import { CompanyDrive, StudentProfile } from '../types/placement';

export interface EligibilityResult {
  isEligible: boolean;
  cgpaPass: boolean;
  branchPass: boolean;
  backlogsPass: boolean;
  reasons: string[];
  matchPercentage: number;
  breakdown: {
    label: string;
    passed: boolean;
    required: string;
    actual: string;
  }[];
}

export function evaluateEligibility(student: StudentProfile, drive: CompanyDrive): EligibilityResult {
  const cgpaPass = student.cgpa >= drive.minCGPA;
  
  // Normalize branches comparison (case insensitive, handling abbreviations)
  const normBranch = student.branch.trim().toUpperCase();
  const branchPass = drive.eligibleBranches.some(b => {
    const normB = b.trim().toUpperCase();
    if (normB === 'ALL' || normB === 'ALL BRANCHES') return true;
    if (normB === normBranch) return true;
    if (normBranch.includes(normB) || normB.includes(normBranch)) return true;
    // Common abbreviations
    if (normB === 'CSE' && (normBranch.includes('COMPUTER') || normBranch.includes('CS'))) return true;
    if (normB === 'ISE' && (normBranch.includes('INFORMATION') || normBranch.includes('IT') || normBranch.includes('IS'))) return true;
    if (normB === 'ECE' && (normBranch.includes('ELECTRONICS') || normBranch.includes('COMMUNICATION'))) return true;
    if (normB === 'EEE' && (normBranch.includes('ELECTRICAL') || normBranch.includes('ELECTRONICS'))) return true;
    if (normB === 'ME' && (normBranch.includes('MECHANICAL'))) return true;
    return false;
  });

  const backlogsPass = student.backlogs <= drive.maxBacklogs;

  const reasons: string[] = [];
  if (!cgpaPass) {
    const diff = (drive.minCGPA - student.cgpa).toFixed(2);
    reasons.push(`CGPA is ${student.cgpa.toFixed(2)}, but minimum requirement is ${drive.minCGPA.toFixed(2)} (deficit: ${diff})`);
  }
  if (!branchPass) {
    reasons.push(`Branch '${student.branch}' is not in allowed branches: ${drive.eligibleBranches.join(', ')}`);
  }
  if (!backlogsPass) {
    reasons.push(`Active backlogs: ${student.backlogs}. Maximum allowed: ${drive.maxBacklogs}`);
  }

  // Calculate match percentage
  let passedCount = 0;
  if (cgpaPass) passedCount++;
  if (branchPass) passedCount++;
  if (backlogsPass) passedCount++;
  const matchPercentage = Math.round((passedCount / 3) * 100);

  const breakdown = [
    {
      label: 'Minimum CGPA',
      passed: cgpaPass,
      required: `≥ ${drive.minCGPA.toFixed(2)}`,
      actual: student.cgpa.toFixed(2),
    },
    {
      label: 'Permitted Branches',
      passed: branchPass,
      required: drive.eligibleBranches.join(', '),
      actual: student.branch,
    },
    {
      label: 'Active Backlog Limit',
      passed: backlogsPass,
      required: `≤ ${drive.maxBacklogs} backlogs`,
      actual: `${student.backlogs} backlog${student.backlogs === 1 ? '' : 's'}`,
    },
  ];

  return {
    isEligible: cgpaPass && branchPass && backlogsPass,
    cgpaPass,
    branchPass,
    backlogsPass,
    reasons,
    matchPercentage,
    breakdown,
  };
}
