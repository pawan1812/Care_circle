# CareCircle — Elderly Care & Medication Management Platform

> **Product Requirements Document (PRD v1.0) Reference Implementation**  
> *Elder-Centred • Shared Care • Dignity First • Proactive Intelligence*

CareCircle is a shared healthcare ecosystem where an elderly person, their family members, and their caretakers collaborate from one single, trusted healthcare profile. It provides proactive medication schedules, adherence tracking, doctor appointments, emergency health cards with QR codes, 1-tap email action links, caregiver burnout prevention, and clinician visit summaries.

---

## 🌟 Core Tenets & Highlights

1. **Elder-First Dignity**:
   - **Elder Mode**: A minimalist, high-contrast, distraction-free interface (maximum 3 content blocks: Next Medicine, Today's Schedule, Next Doctor Visit).
   - **Accessibility (WCAG 2.2 AA)**: Touch targets $\ge 52\text{px}$, base text sizes (Normal, Large, Extra Large), high-contrast mode, and color-blind-safe status badges (never relying on color alone).
   - **Voice Assistant**: Integrated Web Speech API audio read-aloud and speech feedback.
   - **Multilingual Support**: Real-time interface localization in **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)**.

2. **Collaborative Care Circle & Security**:
   - **Passcode & Role-Based Access Control**:
     - *Elder (Owner)*: Master control over all records, privacy, and invites.
     - *Primary Caretaker (Meena)*: Daily routine management, refills, dose logging with attribution.
     - *Caretaker / Visiting Nurse (Sunita)*: Dose administration, vitals recording, and shift handoffs.
     - *Family Member Contributor (Rohan)*: Remote visibility, clinic appointment volunteering, family notes.
     - *Family Member View Only*: Read-only adherence overview.
   - **Single-Use Invite Passcodes**: Cryptographically safe, 8-character single-use codes (e.g. `CARE-7842`) with 24h–72h configurable expiration.
   - **My Privacy Dashboard**: Plain-language breakdown of who sees what, last viewed timestamps, 1-tap revoking, and optional **Elder Approval Mode** for sensitive medication changes.

3. **Medication Management & Safety**:
   - **4-Step Guided Prescription Onboarding**: Autocomplete presets, schedule frequencies (daily, weekdays, PRN, tapering), food instructions (*with food*, *before sleep*, *empty stomach*).
   - **Plain-Language Confirmation**: Summary before saving (*"Take 1 tablet every day at 8 AM and 8 PM after food"*) to prevent data-entry mistakes.
   - **Attribution & Double-Logging Prevention**: Doses log actor attribution (e.g., *"Logged by Meena at 8:05 AM on behalf of Savitri"*), plus 8-second undo toasts.
   - **Doctor Missed-Dose Advice**: Prominently displayed instructions sourced from prescribing doctors (never auto-generated).
   - **Refill Forecasting**: Supply tracking and early alerts when supply drops below threshold (e.g. 7 days remaining).

4. **Appointments & Doctor Visit Summary**:
   - **Companion Assignment**: Flags upcoming appointments (< 48 hrs) without an accompanying person with 1-tap *"Volunteer to Accompany"*.
   - **Calendar Export**: Generates and downloads RFC 5545 standard `.ics` calendar files.
   - **Doctor Visit Summary (PDF/Print)**: 1-page clinician-friendly report with 14-day adherence %, active prescriptions, missed dose reasons, home vitals, and prepared questions for Dr. Kulkarni.

5. **Notifications & 1-Tap Email Action Simulator**:
   - Fully interactive email notification engine demonstrating signed token links (`taken`, `skip`, `snooze`, `volunteer`) that execute directly without requiring login.

6. **Emergency Health Card (SOS)**:
   - Wallet-sized printable format and dynamic QR code for emergency responders and paramedics.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+ or v22+)
- **npm** (v9+ or v10+)

### Running Locally
```bash
# 1. Navigate to the project directory
cd carecircle-app

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

Open your browser at `http://localhost:5173`.

---

## 👥 Personas Pre-Configured in Seed Data

| Persona | Role | Profile Context |
| :--- | :--- | :--- |
| **Savitri Sharma (74)** | Elder (Owner) | Takes 6 daily medications for hypertension, diabetes, and osteoarthritis. |
| **Meena Sharma (50)** | Primary Caretaker | Daughter-in-law living with Savitri; administers doses, handles refills and clinic runs. |
| **Rohan Sharma (42)** | Family Contributor | Son living in Bengaluru; monitors adherence, volunteers for clinic visits. |
| **Sunita Patil** | Visiting Nurse | Records vitals, performs morning hot compress, and logs shift handoffs. |
| **Dr. V. Kulkarni** | Primary Physician | Cardiologist & Diabetologist at Lilavati Hospital. |

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite`
- **Icons**: Lucide React
- **QR Codes**: `qrcode`
- **Delight & Reinforcement**: `canvas-confetti`
- **Internationalization**: Zero-dependency i18n engine (`en`, `hi`, `mr`)
- **State Management & Persistence**: React Context + HTML5 `localStorage` with full state hydration & 1-click Demo Data Reset.
- **Accessibility & Compliance**: WCAG 2.2 AA compliant, DPDP (India 2023) compliant consent-first architecture.
