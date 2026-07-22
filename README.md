<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/logoDark.png">
  <source media="(prefers-color-scheme: light)" srcset="assets/logoLight.png">
  <img alt="HoloCura logo" src="assets/logoLight.png" width="220">
</picture>

A blockchain-based Electronic Health Record (EHR) system that links clinics together on a shared, tamper-proof network, enabling secure medical data exchange while keeping patients in full control of who can access and share their records.

</div>

---


<div align="center">

<video src="https://github.com/user-attachments/assets/18c04851-016d-4881-91bd-b6c5f5596593" controls width="800"></video>

</div>

## Table of Contents

- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Third-Party Services](#third-party-services)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Team](#team)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

---

## Core Features

### User Roles

| Role | Capabilities |
|---|---|
| **Patient** | Book appointments, view/add/edit/delete medical history, join online consultations |
| **Doctor** | Manage schedule, manage clinics, configure vacations, conduct online consultations, generate AI-powered SOAP transcripts, hire nurses |
| **Nurse** | View schedule, manage applications, complete appointments |
| **Admin** | Manage doctors, nurses, and clinics |
| **Super Admin** | Full system access, manage admins |

### Appointment Sessions

- **Online Mode** — Real-time video/audio consultations via Agora RTC
  - Automatic audio recording during consultation
  - SOAP note creation and editing
  - Live chat between doctor and patient
  - Meeting extension capability (doctor only)
  - Session termination control
- **Offline Mode** — Traditional in-person appointments
  - SOAP note creation and editing

### AI-Powered SOAP Notes

- Consultation audio is automatically recorded and processed
- AI generates structured **SOAP** (Subjective, Objective, Assessment, Plan) notes
- Manual editing and confirmation workflow before finalizing

---

## Tech Stack

| Category | Technologies |
|---|---|
| **Core Framework** | Next.js 16, TypeScript |
| **Styling & UI** | Tailwind CSS 4, Shadcn, Lucide React |
| **State Management** | Zustand, TanStack React Query |
| **Internationalization** | next-intl |
| **Real-time Communication** | Socket.IO Client, Agora RTC SDK |
| **Forms & Validation** | React Hook Form, Zod |
| **Utilities** | Axios, date-fns, js-cookie, nuqs, react-easy-crop |

## Third-Party Services

- **Agora.io** — Real-time video/audio infrastructure
- **Google OAuth** — Authentication provider

---

## Project Architecture

HoloCura follows a **feature-based architecture**, organizing code by domain feature rather than technical file type.

### Directory Structure

```
├── app/                          # Next.js App Router pages
│   ├── (pages)/(dashboards)/    # Dashboard routes (patient, doctor, nurse, admin)
│   ├── (pages)/(auth)/          # Authentication routes
│   ├── (pages)/join/            # Join application routes
│   ├── api/                     # API route handlers
│   └── layout.tsx               # Root layout with providers
│
├── features/                     # Feature-based modules
│   ├── appointment-session/      # Video/audio consultation sessions
│   │   ├── api/                  # API calls
│   │   ├── components/           # Container/Presentational components
│   │   ├── hooks/                # Feature-specific hooks
│   │   ├── query/                # React Query hooks
│   │   ├── types/                # TypeScript types
│   │   └── utils/                # Utility functions
│   ├── clinics/                  # Clinic browsing and booking
│   ├── dashboards/                # Role-specific dashboards
│   ├── home/                     # Landing page components
│   ├── join/                     # Nurse/Doctor join application
│   ├── settings/                  # User settings management
│   └── user/                     # User profile and authentication
│
├── components/                   # Shared UI components
│   ├── ui/                       # Reusable UI primitives (buttons, cards, etc.)
│   ├── layout/                   # Layout components (Navbar, Sidebar, Footer)
│   └── common/                   # Shared components (LanguageSwitcher, etc.)
│
├── lib/                          # Core utilities and services
│   ├── apiClient.ts              # Axios instance with interceptors
│   ├── socketClient.ts           # Socket.IO client singleton
│   ├── auth.ts                   # Authentication utilities
│   ├── tokenRefresh.ts           # Token refresh logic
│   └── helpers.ts                # General helper functions
│
├── stores/                       # Zustand state stores
│   ├── useUserStore.ts           # User authentication state
│   ├── useSoapDraftStore.ts      # SOAP notes draft state
│   └── ...                       # Other feature stores
│
├── contexts/                     # React context providers
│   ├── LanguageProvider.tsx      # Language/translation context
│   ├── QueryProvider.tsx         # React Query provider
│   ├── ThemeProvider.tsx         # Dark/light theme context
│   └── SocketProvider.tsx        # Socket.IO provider
│
├── locales/                      # Internationalization files
│   ├── en/                       # English translations
│   │   ├── general/              # Common translations
│   │   ├── pages/                 # Page-specific translations
│   │   └── dashboards/            # Dashboard translations
│   └── ar/                       # Arabic translations
│
├── types/                        # Shared TypeScript types
└── constants/                    # Navigation items and static data
```

### Component Patterns

#### Container/Presentational Pattern

Each feature uses a container/presentational separation to keep data logic and UI rendering cleanly decoupled:

```
features/
└── dashboard/
    └── components/
        └── medical-history/
            ├── MedicalHistoryContainer.tsx        # State management, data fetching
            └── MedicalHistoryPresentational.tsx    # Pure UI rendering
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### Development

```bash
npm run dev
# or
yarn dev
```

### Production Build

```bash
npm run build
npm run start
```

---

## Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes
   ```bash
   git commit -m "Add: your feature description"
   ```
4. **Push** to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open** a Pull Request describing your changes

Please ensure your code follows the existing feature-based architecture and passes linting before submitting a PR.

---

## Team

| Name | Contact |
|---|---|
| **Kareem Abdel Nabi** | [kareem-abdelnabi.vercel.app](https://kareem-abdelnabi.vercel.app/) |
| **Enjy Ashraf** | [enjyashraf18@gmail.com](mailto:enjyashraf18@gmail.com) |
| **Salah Mohamed** | — |
| **Youssef Aboelella** | — |

### Supervised By

- **Dr. Amira Gaber**
- **Eng. Mohamed Adel**
- **Eng. Khalid Zahra**

---

## Acknowledgments

Special thanks to our supervisors for their invaluable guidance and support throughout the development of this project.

---

## Contact

For questions, feedback, or collaboration inquiries, feel free to reach out to any of the team members listed above.
