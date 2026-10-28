# CampusPlace Security Specification (Phase 0 TDD)

## 1. Data Invariants

1. **Student Profile Invariant**: Every `/student_profiles/{userId}` document must have `uid == request.auth.uid == userId`, verified email (`request.auth.token.email_verified == true`), and strict PII isolation (`get` restricted to owner or admin).
2. **Drive Creation & Mutation Invariant**: Only verified Placement Officers / Admins (`isAdmin()`) can create, update, or delete `/drives/{driveId}` and `/notices/{noticeId}` documents.
3. **Application Ownership & Relational Invariant**: Every `/applications/{applicationId}` document must have `studentUid == request.auth.uid`, reference an existing `/drives/{driveId}` document via `exists()`, and lock terminal states (`Offered`, `Rejected`) against non-admin updates.
4. **Reminder Ownership Invariant**: Every `/reminders/{reminderId}` document must have `ownerUid == request.auth.uid` and only be readable/writable by its owner.
5. **Temporal & Volumetric Invariant**: Every string and array is bounded by explicit `.size()` constraints, and `createdAt`/`updatedAt` must equal `request.time`.

## 2. The "Dirty Dozen" Payloads

1. **Shadow Field Injection on StudentProfile**: `{ "uid": "u1", ..., "isAdmin": true }` -> Rejected by `hasOnly()`.
2. **Identity Spoofing on Application Creation**: Authenticated as `userA`, submits `studentUid: "userB"` -> Rejected by `incoming().studentUid == request.auth.uid`.
3. **Orphaned Application Write**: `driveId: "non-existent-drive"` -> Rejected by `exists(/databases/$(database)/documents/drives/$(incoming().driveId))`.
4. **Unverified Admin Email Spoof**: Token has `email: "samarthangadi0@gmail.com"` with `email_verified: false` -> Rejected by `request.auth.token.email_verified == true`.
5. **PII Leak via Unauthorized Get**: Authenticated `userB` requests `get(/student_profiles/userA)` -> Rejected by `request.auth.uid == userId || isAdmin()`.
6. **Unbounded List Scraping on Reminders**: Client issues unfiltered `list` on `/reminders` -> Rejected unless `resource.data.ownerUid == request.auth.uid`.
7. **Denial-of-Wallet 10KB String Poisoning**: `description` with 10,000 characters on `/drives/{driveId}` -> Rejected by `data.description.size() <= 1000`.
8. **ID Poisoning on Path Variable**: Document ID with 300 characters or special characters -> Rejected by `isValidId()`.
9. **Terminal State Bypass on Application**: Student attempts to update an application whose `existing().overallStatus == 'Rejected'` -> Rejected by terminal state lock.
10. **Immortal Field Mutation**: Updating `createdAt` or `studentUid` on `/applications/{applicationId}` -> Rejected by `incoming().createdAt == existing().createdAt && incoming().studentUid == existing().studentUid`.
11. **Client Timestamp Forgery**: Passing arbitrary past/future timestamp for `updatedAt` -> Rejected by `incoming().updatedAt == request.time`.
12. **Array Type/Size Poisoning**: Passing 50 branches in `eligibleBranches` -> Rejected by `data.eligibleBranches.size() <= 10`.
