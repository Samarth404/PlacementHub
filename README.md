# 🎓 CampusPlace — Unified Placement Tracking System

**CampusPlace** is a centralized campus recruitment and placement tracking platform designed to eliminate scattered placement communication across emails, messaging groups, college portals, and noticeboards. It empowers students with instant eligibility verification, multi-round selection tracking, and deadline alerts while equipping Training & Placement Officers (TPOs) with a secure administrative console, candidate stage progression controls, and privacy-compliant roster exports.

---

## 🚨 Problem Statement
Students receive placement updates through fragmented channels—emails, college notices, WhatsApp/Telegram groups, and external career portals. Because information is scattered:
- Students frequently miss job opportunities, registration deadlines, eligibility cutoffs, or interview schedules.
- Placement Officers struggle to maintain accurate, up-to-date records of student applications and multi-round selection progress while safeguarding student privacy.

---

## ✨ Key Features

### 👨‍🎓 Student Portal
- **Centralized Placement Feed & Notice Aggregator**: Consolidates recruitment drives and urgent announcements from *Email Notices*, *College Portals*, *TPO WhatsApp Groups*, and *Official Bulletins* in one place.
- **Automated Multi-Factor Eligibility Engine**: Deterministically checks whether a student meets company cutoffs across **Minimum CGPA**, **Eligible Engineering Branches**, and **Active Backlog Limits**, displaying exact point deficits or pass breakdowns.
- **Interactive "What-If" Eligibility Simulator**: Allows students to simulate hypothetical CGPA improvements, backlog clearances, or branch criteria to plan their preparation.
- **Multi-Stage Selection Pipeline Tracker**: Visualizes progress across every recruitment stage (*Resume Shortlisting → Online Assessment → Technical Rounds → HR Interview → Offer Letter*) with scheduled times, meeting links, and prep notes.
- **Smart Deadline & Interview Reminders**: Tracks critical dates with one-click **Google Calendar sync** and downloadable **RFC 5545 `.ics` calendar files** for Outlook and Apple Calendar.

### 🛡️ TPO Admin Console (Placement Officer)
- **Role-Based Access Control (RBAC)**: Separate authentication gateway isolating the Student Portal from the TPO Administration Console.
- **Drive & Notice Broadcasting**: Publish new company recruitment drives with custom CGPA cutoffs, allowed branches, backlog limits, CTC details, and custom selection rounds.
- **Candidate Stage Progression**: Advance applicants across interview rounds, record evaluator feedback, mark rejections, or issue final placement offers in real time.
- **Student PII Privacy Protection (Noticeboard Mode)**: One-click privacy toggle that masks sensitive student data (emails, phone numbers, and USNs) for safe public projection or noticeboard sharing.
- **Audit-Ready CSV Export**: Download verified applicant rosters in either full administrative format or privacy-masked noticeboard format.

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Authentication & Database**: Firebase Authentication (Google Sign-In + Role Credentials), Cloud Firestore (Real-time sync & Zero-Trust Security Rules)
- **Build Tooling**: Vite

---

## 🔐 Demo Login Credentials

### Student Portal Accounts
| Student Name | Branch | CGPA | Backlogs | Login ID (USN) | Security PIN |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Ananya Sharma** | CSE | `8.72` | `0` | `1RV21CS042` | `STU2026` |
| **Rohan Verma** | ECE | `7.35` | `0` | `1RV21EC089` | `STU2026` |
| **Pooja Hegde** | ISE | `6.80` | `1` | `1RV21IS054` | `STU2026` |

### TPO Admin Console Account
| Role | Login Email | Passcode |
| :--- | :--- | :--- |
| **Chief Placement Officer** | `admin@rvce.edu.in` | `TPO-ADMIN-2026` |

---

## 🚀 Getting Started Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/campusplace.git
   cd campusplace




1. **Install dependencies**
   ```bash
   npm install
   
2. **Start the development server**
   ```bash
   npm run dev
   
3. **Build for production**
   ```bash
   npm run build
