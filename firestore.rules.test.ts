/**
 * Firestore Security Rules Test Suite (Dirty Dozen Verification)
 * Verifies all 12 adversarial payloads return PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const dirtyDozenTests: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on StudentProfile',
    collection: '/student_profiles/user_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'student@rvce.edu.in', email_verified: true },
    payload: { uid: 'user_1', name: 'Test', isAdmin: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Identity Spoofing on Application Creation',
    collection: '/applications/app_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'student@rvce.edu.in', email_verified: true },
    payload: { studentUid: 'user_2', driveId: 'drv_1' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Orphaned Application Write (Non-existent Drive)',
    collection: '/applications/app_2',
    operation: 'create',
    auth: { uid: 'user_1', email: 'student@rvce.edu.in', email_verified: true },
    payload: { studentUid: 'user_1', driveId: 'missing_drive_999' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Unverified Admin Email Spoof',
    collection: '/drives/drv_spoof',
    operation: 'create',
    auth: { uid: 'spoof_uid', email: 'samarthangadi0@gmail.com', email_verified: false },
    payload: { companyName: 'Fake Corp' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'PII Leak via Unauthorized Get on StudentProfile',
    collection: '/student_profiles/user_1',
    operation: 'get',
    auth: { uid: 'user_2', email: 'other@rvce.edu.in', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Cross-User Reminder Read',
    collection: '/reminders/rem_1',
    operation: 'get',
    auth: { uid: 'user_2', email: 'other@rvce.edu.in', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Denial-of-Wallet Oversized Description String',
    collection: '/drives/drv_big',
    operation: 'create',
    auth: { uid: 'admin_1', email: 'samarthangadi0@gmail.com', email_verified: true },
    payload: { description: 'X'.repeat(5000) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'ID Poisoning on Path Variable',
    collection: '/reminders/invalid$id#with!bad@chars',
    operation: 'create',
    auth: { uid: 'user_1', email: 'student@rvce.edu.in', email_verified: true },
    payload: { ownerUid: 'user_1' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Terminal State Bypass on Rejected Application',
    collection: '/applications/app_rejected',
    operation: 'update',
    auth: { uid: 'user_1', email: 'student@rvce.edu.in', email_verified: true },
    payload: { overallStatus: 'Offered' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Immortal Field Mutation (createdAt / studentUid)',
    collection: '/applications/app_1',
    operation: 'update',
    auth: { uid: 'user_1', email: 'student@rvce.edu.in', email_verified: true },
    payload: { studentUid: 'user_99' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Client Timestamp Forgery',
    collection: '/reminders/rem_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'student@rvce.edu.in', email_verified: true },
    payload: { ownerUid: 'user_1', createdAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Array Size Poisoning on Eligible Branches',
    collection: '/drives/drv_array',
    operation: 'create',
    auth: { uid: 'admin_1', email: 'samarthangadi0@gmail.com', email_verified: true },
    payload: { eligibleBranches: new Array(25).fill('CSE') },
    expectedResult: 'PERMISSION_DENIED',
  },
];
