# Kalaivani Sainik Academy — Web Portal & Admission CRM

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?style=for-the-badge&logo=sqlite)](https://github.com/WiseLibs/better-sqlite3)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Graphics-black?style=for-the-badge&logo=three.js)](https://threejs.org/)

A full-stack, enterprise-grade web application and admission management system engineered for **Kalaivani Sainik Coaching Centre**. Built with Next.js 14 (App Router), TypeScript, Three.js, and an embedded SQLite database engine.

---

## Table of Contents

- [Key Highlights](#key-highlights)
- [Public Cadet & Parent Portal](#public-cadet--parent-portal)
- [Internal Academy CRM & Telephony](#internal-academy-crm--telephony)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Initialization & Seeding](#database-initialization--seeding)
  - [Running the Application](#running-the-application)
- [Default User Credentials](#default-user-credentials)
- [Security & Data Integrity](#security--data-integrity)
- [Verification & Quality Assurance](#verification--quality-assurance)
- [API Reference](#api-reference)

---

## Key Highlights

- **Interactive 3D Experience:** WebGL canvas powered by Three.js rendered directly in the hero section.
- **Cadet Eligibility Engine:** Interactive client-side calculator determining student eligibility across AISSEE, RMS, and RIMC programs based on age and academic class.
- **Unified Telephony Integration:** Webhook event receiver with HMAC-SHA256 signature verification, idempotency protection, and simulated call testing.
- **End-to-End Admission Pipeline:** Multi-stage CRM pipeline covering stages from `new` to `admission_confirmed`.
- **Security & Defense Hardening:** Salted PBKDF2 password hashing, append-only security audit log, and protection against CSV Formula Injection (CWE-1236).

---

## Public Cadet & Parent Portal

The public-facing website provides a high-converting, mobile-responsive experience for parents and prospective cadets:

- **Hero & Admission CTA:** Interactive 3D graphics with prominent admission announcements and immediate lead-capture modals.
- **Curriculum & Program Pages:**
  - **AISSEE (All India Sainik Schools Entrance Examination):** Class VI & Class IX coaching structure.
  - **RMS (Rashtriya Military Schools):** Common Entrance Test (CET) syllabus and interview preparation.
  - **RIMC (Rashtriya Indian Military College):** National level examination and physical training protocols.
- **Interactive Tools:**
  - **Cadet Daily Routine:** Visual hour-by-hour timeline of training, academics, and sports.
  - **Cadet Eligibility Calculator:** Dynamic validation based on official birthdate windows.
  - **Prospectus Download Modal:** Lead-gated PDF prospectus access.
- **Institutional Proof & Credibility:**
  - Verified student results, rank holders, and allotted defense academies.
  - Authenticated parent and alumnus testimonials.
  - Faculty directory with military and academic credentials.
  - Campus facilities showcase (obstacle courses, smart classrooms, library, mess).
- **Communication Touchpoints:**
  - Floating contact dock & mobile quick-action bar (Direct dial, WhatsApp, Instant Enquiry).
  - Built-in UTM parameter capture for tracking organic vs. paid campaigns.

---

## Internal Academy CRM & Telephony

A secure, role-based internal back-office suite accessible at `/admin`:

```
/admin
├── Dashboard           → High-level KPIs, funnel conversion rates, lead source analytics
├── Pipeline            → Drag-and-drop / stage-based Kanban pipeline for admission progression
├── Contacts            → Master phone directory, duplicate detection, and contact merge modal
├── Calls               → Inbound and outbound call logs with provenance tracking
├── Follow-ups          → Priority-based follow-up scheduling with counsellor assignment
├── Telephony           → Provider configurations, webhook health, and call simulator
├── CMS Management      → Live content editor for announcements, faculty, FAQs, and courses
├── Reports             → CSV exports with anti-injection sanitization
├── Staff               → User management, roles (Super Admin, Manager, Counsellor, Auditor)
└── Audit Trail         → Immutable log tracking who viewed, updated, or exported sensitive records
```

---

## Architecture & Tech Stack

```mermaid
graph TD
    Client[Parent / Cadet Browser] -->|HTTPS| NextApp[Next.js 14 App Router]
    Admin[Counsellor / Admin] -->|Session Auth| NextApp
    
    subgraph Frontend Components
        ThreeScene[Three.js 3D Hero]
        Modals[Prospectus & Quick Call Modals]
        Calculators[Cadet Eligibility Calculator]
        AdminPanels[CRM & Pipeline Views]
    end

    subgraph Server & API Routes
        AuthAPI[/api/auth/*]
        EnquiriesAPI[/api/enquiries]
        TelephonyAPI[/api/telephony/*]
        AdminAPI[/api/admin/*]
        HealthAPI[/api/health]
    end

    subgraph Data Layer
        SQLite[(better-sqlite3 / kalaivani.db)]
        WAL[WAL Mode & Foreign Keys]
        Audit[Append-only Audit Log]
    end

    NextApp --> Server & API Routes
    Server & API Routes --> Data Layer
```

### Technology Matrix

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | Server-Side Rendering (SSR), Server Components, and Edge Routing |
| **Language** | TypeScript 5.6 | Strict type-safety across backend models and frontend props |
| **Graphics** | Three.js | Procedural 3D scene rendering |
| **Styling** | Vanilla CSS Design System | Custom CSS variables, glassmorphism, responsive grid layouts |
| **Icons** | Lucide React | Modern, accessible SVG icon library |
| **Database** | SQLite via `better-sqlite3` | High-throughput WAL mode, zero external database dependencies |
| **Auth** | PBKDF2 + Secure HTTP-only Cookie | 100,000 iterations, 64-byte key length with random salt |

---

## Directory Structure

```text
├── data/                       # Database storage directory (.gitignore tracked)
│   └── .gitkeep
├── public/                     # Static media, documentation, and prospectus assets
│   ├── docs/                   # Academy prospectus PDF
│   ├── images/                 # Campus, classroom, faculty, and training photography
│   └── videos/                 # Cadet training video reel
├── scripts/                    # Maintenance & verification CLI scripts
│   ├── init-db.js              # Database initialization
│   ├── seed-db.js              # Production-like data seeding
│   ├── test-db.js              # Database connectivity test
│   └── verify-system.js        # 16-point automated sanity test suite
├── src/
│   ├── app/                    # Next.js App Router pages and REST API routes
│   │   ├── (public)/           # About, Admissions, Courses, Facilities, Faculty, Results...
│   │   ├── admin/              # Back-office CRM, Pipeline, Telephony, CMS, Audit pages
│   │   └── api/                # REST endpoints (auth, admin, enquiries, telephony, health)
│   ├── components/             # Reusable UI components, 3D scenes, modals, contact docks
│   │   └── admin/              # Back-office specialized modals (Call Simulator, Merge Contacts)
│   └── lib/                    # Core business logic
│       ├── analytics.ts        # Client-side event logging & UTM handling
│       ├── auth.ts             # Password hashing & session token management
│       ├── db.ts               # Schema migrations, seed handlers, and SQLite singleton
│       ├── telephony.ts        # Telephony event dispatcher & webhook signature validation
│       └── utils.ts            # Formatting, Indian phone normalization, CSV sanitization
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js:** `v18.17.0` or higher
- **npm:** `v9.0.0` or higher
- **Git**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dheena-cr7/Academy_Project-.git
   cd Academy_Project-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Database Initialization & Seeding

The database auto-initializes upon first web request. To manually initialize or populate sample seed data:

```bash
# Initialize schema
node scripts/init-db.js

# Seed sample courses, admin accounts, faculty, and testimonials
node scripts/seed-db.js
```

### Running the Application

Start the local development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

To access the internal staff portal, navigate to: [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Default User Credentials

When seeded with `scripts/seed-db.js`, the following pre-configured credentials are ready for testing:

| Role | Username | Default Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `Kalaivani@2026Admin` | Full CRM, CMS, Telephony, Staff Management, Audit Logs |
| **Senior Counsellor** | `counsellor1` | `Counsellor@2026` | Contacts, Pipeline, Call Management, Follow-ups |

> **Security Note:** Change default passwords in a production deployment by setting the `ADMIN_INITIAL_PASSWORD` environment variable or updating them directly in the staff management panel.

---

## Security & Data Integrity

1. **PBKDF2 Password Hashing:** User passwords are never stored in plaintext. They are salted with a 16-byte cryptographically secure random value and hashed using PBKDF2 (100,000 iterations, SHA-512).
2. **CSV Formula Injection Prevention (CWE-1236):** All report exports prepend single-quote escapes (`'`) to values starting with `=`, `+`, `-`, or `@` to neutralize spreadsheet script execution.
3. **Webhook Idempotency:** Inbound telephony webhooks store event IDs in a `webhook_events` table to prevent duplicate processing of replayed network requests.
4. **HMAC-SHA256 Signature Verification:** External webhook calls are validated with secret HMAC signatures to prevent unauthorized event injection.
5. **Indian Phone Number Normalization:** Standardizes inputs (+91, leading 0, hyphenated) into valid 10-digit mobile formats.

---

## Verification & Quality Assurance

Run the built-in system verification suite to validate phone normalization, CSV escaping, schema integrity, HMAC signing, and call provenance classification:

```bash
node scripts/verify-system.js
```

Expected output:
```text
================================================================
KALAIVANI SAINIK RIMC COACHING CENTRE - SYSTEM VERIFICATION SUITE
================================================================
1. Testing Phone Normalization: [PASS]
2. Testing CSV Formula Injection Defense (CWE-1236): [PASS]
3. Testing Database & Schema Integrity: [PASS]
4. Testing HMAC Signature & Webhook Processing: [PASS]
5. Testing Call Provenance Classification: [PASS]
================================================================
VERIFICATION SUMMARY: 16 Passed, 0 Failed
================================================================
```

---

## API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check endpoint returning DB status, uptime, and node environment |
| `/api/enquiries` | `POST` | Public admission enquiry submission endpoint |
| `/api/auth/login` | `POST` | Authenticates staff and sets HTTP-only session cookie |
| `/api/auth/logout` | `POST` | Clears authentication session |
| `/api/admin/contacts` | `GET`, `POST` | Contact directory listing and manual contact creation |
| `/api/admin/contacts/merge`| `POST` | Merges duplicate lead profiles into a primary contact |
| `/api/admin/pipeline` | `GET`, `PATCH` | Retrieves and updates admission pipeline stage status |
| `/api/telephony/webhook` | `POST` | Receives and validates telephony provider events |
| `/api/telephony/simulate`| `POST` | Sandbox test tool for triggering mock inbound/outbound calls |

---

## License

This project is proprietary and confidential to **Kalaivani Sainik Academy**. Unauthorized copying, distribution, or deployment without explicit permission is strictly prohibited.
