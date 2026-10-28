# CampusPlace: Unified Placement Tracking System

A centralized, responsive placement tracking platform that eliminates scattered notices across emails, groups, and noticeboards, providing students with automated eligibility checks and stage-by-stage pipeline tracking while equipping placement officers with real-time drive management, progress audits, and privacy-compliant exports.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions have been aligned based on your input:
> - **Dual-Role Perspective**: Seamless top-bar toggle between **Student View** (personal eligibility calculator, applied drives, stage pipeline, reminders) and **Placement Officer View** (company drive creation, applicant progress tracking, student verification audits, and batch announcements).
> - **Visual Direction**: Clean Academic SaaS styling using crisp light slate backgrounds, rich indigo primary accents (`#4338CA`), subtle hairline dividers, and tabular metrics for error-free grade and deadline tracking.
> - **Prioritized Functional Capabilities**:
>   1. Automated eligibility checking (CGPA cutoffs, engineering branches, maximum allowed active backlogs).
>   2. Multi-stage selection pipeline tracker (Application $\rightarrow$ Aptitude $\rightarrow$ Technical Round $\rightarrow$ HR Interview $\rightarrow$ Offer Letter).
>   3. Unified Notice Aggregator with source filtering (Email Notices, WhatsApp/Telegram groups, College Portals) and automated calendar/deadline reminders.
>   4. Student Privacy & Security Controls (selective PII masking, USN/Roll number anonymization mode for public listings, and role-authorized CSV export).

---

### 1. Overview & Core Concept

- **What It Does**:
  Solves the challenge of fragmented placement communication by consolidating job opportunities, eligibility rules, multi-round interview schedules, and application updates into a single intuitive portal. Students immediately see which companies they qualify for, what round they are currently in, and when deadlines approach. Placement Officers can broadcast drives, track student conversions across rounds, and generate clean reports without messy spreadsheets.
- **Target Audience / Persona**:
  - *Final & Pre-Final Year College Students*: Need instant clarity on eligibility, interview timings, prep links, and deadline alerts without monitoring 10 different chat groups.
  - *Training & Placement Officers (TPOs) & Student Coordinators*: Need verified applicant lists, round qualification tracking, and exportable records for college audits and accreditation.
- **Key Value**:
  Zero missed opportunities for students through automated eligibility calculation and deadline alerts; 80% reduction in manual coordination overhead for placement cells.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Student Journey**:
   - Views **My Profile & Academic Snapshot** (Department, CGPA, Backlogs, Resume link).
   - Explores **Central Placement Feed**: Unified drive listings tagged with clear status markers and days remaining until deadline.
   - Runs **Instant Eligibility Check**: The system compares their profile with company requirements (e.g., Min CGPA 7.5, CS/IT/ECE only, 0 active backlogs) and displays clear pass/fail criteria with actionable explanations.
   - Tracks **My Active Applications Pipeline**: A visual Kanban / stepper showing active stages (Aptitude Test $\rightarrow$ Coding Round $\rightarrow$ Tech Interview $\rightarrow$ Offer Released) with dates, meeting links, and prep notes.
   - Sets **Notice & Deadline Reminders**: Adds drive deadlines and interview slots to their personal reminder calendar or copies .ics/calendar links.

2. **Placement Officer (TPO) Journey**:
   - Posts a **New Recruitment Drive** with company profile, package (CTC), minimum CGPA cutoff, permitted branches, backlog limit, and recruitment rounds schedule.
   - Monitors **Applicant Records & Funnel Analytics**: Dynamic tabular roster of applied candidates with stage-by-stage progression (Advance candidate, mark rejected, or award offer).
   - Uses **Privacy & Anonymization Toggle**: Masks private phone numbers/emails when projecting or sharing drive lists in common forums, showing only masked USNs.
   - Exports verified audit-ready reports as CSV for college compliance.

#### Visual Identity & Theme
- **Aesthetic Direction**: Clean Academic SaaS with purposeful clarity, high-contrast tabular typography, and restrained borders.
- **Color Palette**:
  - Dominant Canvas: Crisp neutral white (`#FFFFFF`) and soft slate background (`#F8FAFC`).
  - Structural Surfaces: Pure white cards with delicate borders (`#E2E8F0`).
  - Primary Accent: Academic Indigo (`#4338CA` / `#4F46E5`) for primary CTAs, active pipeline nodes, and selection highlights.
  - Semantic Statuses:
    - Qualified / Selected / Shortlisted: Emerald (`#059669`)
    - In Review / Scheduled: Amber (`#D97706`)
    - Ineligible / Not Shortlisted: Slate Red (`#DC2626`)
- **Typography**:
  - Headings & Navigation: `Plus Jakarta Sans` / `Outfit` (600/700 weight) for crisp, modern structure.
  - Body Prose: Clean sans (`DM Sans` / `Plus Jakarta Sans`, 400/500 weight).
  - Metrics, Dates & CGPA: Monospace tabular numbers (`tabular-nums font-mono`) to prevent visual jitter.
- **Top Bar Contract**:
  - Left: Wordmark `CampusPlace` with a graduation crest icon and subtle role tag.
  - Center: Clean single-line navigation links (`Drives & Notices`, `My Applications`, `Eligibility Engine`, `Placement Analytics`).
  - Right: Quick Role Switcher (`Student View` $\leftrightarrow$ `TPO Admin`) and Add Drive / Reminder action.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Interactive Data Engine with LocalStorage Persistence**
  - *Chosen Approach*: Fully functional, reactive state management using React and localStorage pre-seeded with rich, realistic campus placement scenarios (e.g. Google, Microsoft, Infosys, Cisco, Accenture, TCS).
  - *Why*: Allows instant testing, zero backend friction, runs offline in standard web browsers, and strictly respects the prompt's guidance ("Tip: You don't need a high-tech stack... Keep it simple with HTML, CSS and JavaScript").
  - *Alternatives Considered*: Remote SQL or Firebase backend — avoided to maintain zero-setup friction and rapid evaluation while preserving full CRUD capability and persistent state.

- **Decision 2: Automated Multi-Factor Eligibility Engine**
  - *Chosen Approach*: Deterministic rule evaluation checking:
    1. Overall CGPA $\ge$ Cutoff.
    2. Student branch in eligible branches list.
    3. Active backlogs $\le$ Max backlogs allowed.
    4. Gender / Degree criteria (if specified).
  - *Why*: Transparent, instant feedback with a breakdown list (e.g., "CGPA: 8.4 $\ge$ 7.5 ✓ | Branch: CSE ✓ | Backlogs: 0 $\le$ 0 ✓ $\rightarrow$ Eligible to Apply").

- **Decision 3: Privacy & Security Controls with Masked Export**
  - *Chosen Approach*: Interactive privacy mode toggle that immediately obscures phone numbers and personal emails (`s****@college.edu`, `+91-98****1234`), with secure CSV export formats (standard administrative format vs anonymized noticeboard format).
  - *Why*: Directly solves the challenge of protecting student information specified in the problem statement.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CampusPlace Application                         │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar: [CampusPlace Wordmark] ── [Nav Links] ── [Role Switcher]     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────┐ │
│  │   Student / TPO Banner  │  │  Global Placement Metric Ribbon      │ │
│  │   Active Profile/Role   │  │  Active Drives | Eligible | Offers   │ │
│  └─────────────────────────┘  └──────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Tab View Router (State-Driven)                                   │  │
│  │ ├─ Tab 1: Central Placement Feed (Notices, Drives, Deadlines)    │  │
│  │ ├─ Tab 2: Interactive Eligibility Checker & Matcher              │  │
│  │ ├─ Tab 3: Selection Process Pipeline Tracker (Kanban / Stepper)  │  │
│  │ ├─ Tab 4: TPO Drive Manager & Applicant Roster (Audit & Export)  │  │
│  │ └─ Tab 5: Deadline Reminders & Notification Digest               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Storage & Persistence Layer: LocalStorage with Seeds             │  │
│  │ (Company Drives, Student Profile, Applications, Reminders)       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Key Data Entities
1. **CompanyDrive**: ID, companyName, role, packageCTC, location, deadlineDate, driveDate, minCGPA, eligibleBranches, maxBacklogs, description, rounds: `string[]`, source: `'Email Notice' | 'College Portal' | 'TPO WhatsApp' | 'Careers Site'`, registrationLink.
2. **StudentProfile**: id, name, usn, email, phone, branch, cgpa, backlogs, graduationYear, resumeUrl.
3. **ApplicationRecord**: id, driveId, studentId, studentUSN, studentName, currentStageIndex, status: `'Applied' | 'In Progress' | 'Selected' | 'Rejected'`, appliedAt, nextInterviewDate, interviewLink, notes.
4. **NoticeReminder**: id, driveId, title, dueDate, type: `'Application Deadline' | 'Online Assessment' | 'Interview'`, reminderTriggered, isRead.

#### State & Interaction Mapping
- **Role Switch**: Switching to Placement Officer immediately unlocks the "Post New Drive", "Update Candidate Round", and "Export Verified Roster" toolbars; switching to Student View recalculates match percentages against the current active student profile.
- **Live Search & Multi-Filters**: Instant client-side search across company names, roles, branches, eligibility status (Eligible Only / All), and sources.
- **Stage Progression Handlers**: One-click advance candidate to the next round with date & link assignment, updating pipeline states dynamically.
