# Developer Assessment Platform Frontend

Production-style frontend for the **Developer Assessment Platform** backend.

- **Live frontend:** https://developer-assessment-platform-front.vercel.app
- **Live backend:** https://developer-assessment-platform.onrender.com
- **Backend API:** https://developer-assessment-platform.onrender.com/api/v1
- **Swagger:** https://developer-assessment-platform.onrender.com/api-docs

## Requirement Coverage

### Next.js App Router architecture
- Next.js 15 App Router
- Server Components are the default for route entry points and public content
- Client Components are isolated to interaction-heavy UI such as forms, charts, timers, filters and mutations
- Root `layout.tsx`, `loading.tsx`, `error.tsx`, and `not-found.tsx`
- Segment-level loading skeletons for assessment, candidate, reviewer, admin and payment areas
- Metadata API on public and dashboard pages

### UI / UX
- Tailwind CSS 4
- Radix UI Dialog and Tabs primitives
- Mobile-first responsive layout
- Light/dark theme with persisted preference
- Sonner toast notifications
- Reusable cards, badges, skeletons, empty states, stat cards, search inputs and confirmation dialogs
- `next/image` for remote profile images

### Authentication and authorization
- Three fixed roles: **CANDIDATE**, **REVIEWER**, **ADMIN**
- Next.js middleware protects role-specific route prefixes
- Login and register requests run through Next.js route handlers
- Access and refresh tokens are stored as **HttpOnly cookies**
- Same-origin backend proxy attaches Bearer tokens and refreshes expired access tokens
- Role-aware navigation and UI rendering

### One-click demo login
The login page has dedicated one-click demo buttons that immediately authenticate and redirect to the matching dashboard.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@devassess.com` | `Admin123!` |
| Candidate | `candidate@devassess.com` | `Candidate123!` |
| Reviewer | `reviewer@devassess.com` | `Reviewer123!` |

### API and state management
- TanStack Query for remote server state, caching, refetching and mutations
- React Context for authenticated user/session UI state
- Real deployed backend API only for core workflows
- No mock assessment, attempt, payment, review or admin data

### Forms
- React Hook Form
- Zod
- `@hookform/resolvers`
- Frontend validation mirrors backend rules for:
  - login
  - candidate registration
  - profile update
  - multi-step assessment creation
  - question creation
  - reviewer evaluation

### URL state synchronization
Search, filtering, sorting and pagination are reflected in the URL for:
- public assessments
- candidate attempts
- reviewer assessments
- admin users
- admin audit logs

### Stripe payment integration
Paid assessments create a real Stripe Checkout Session through the backend.

Flow:

```text
Candidate enrolls
  -> PENDING_PAYMENT
  -> frontend requests Stripe Checkout Session
  -> browser opens Stripe-hosted Checkout
  -> Stripe webhook updates Payment to SUCCEEDED
  -> backend moves Attempt to READY
  -> frontend success page verifies the backend state
```

No manual or fake payment success action exists.

## Required Backend Production URLs

For the deployed frontend payment return flow, configure these on Render:

```env
FRONTEND_URL=http://localhost:3000,https://developer-assessment-platform-front.vercel.app
STRIPE_SUCCESS_URL=https://developer-assessment-platform-front.vercel.app/payment/success?session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=https://developer-assessment-platform-front.vercel.app/payment/cancel
```

The Stripe webhook remains:

```text
https://developer-assessment-platform.onrender.com/api/v1/payments/webhook
```

## Page Coverage

The project implements more than the required 18 functional routes.

### Public
- `/`
- `/about`
- `/features`
- `/pricing`
- `/faq`
- `/assessments`
- `/assessments/[id]`

### Authentication
- `/login`
- `/register`

### Candidate
- `/dashboard`
- `/dashboard/profile`
- `/dashboard/payments`
- `/attempts`
- `/attempts/[id]`

### Reviewer
- `/reviewer`
- `/reviewer/assessments`
- `/reviewer/assessments/new`
- `/reviewer/assessments/[id]`
- `/reviewer/reviews/[id]`
- `/reviewer/analytics`
- `/reviewer/profile`

### Admin
- `/admin`
- `/admin/users`
- `/admin/audit`

### Payment
- `/payment/success`
- `/payment/cancel`

### Utility
- custom `not-found.tsx`
- global `error.tsx`

## Multi-step workflow

Reviewer assessment creation is a validated three-step wizard:

1. Basics — title, slug, description, difficulty
2. Scoring — duration and passing score
3. Payment & review — fee, currency and final review

After creation, the reviewer adds real questions and publishes through the backend.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Windows PowerShell:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification

```bash
npm run typecheck
npm run build
```

GitHub Actions runs type checking and the Next.js production build on every push to `main`.

A Playwright-based live smoke suite verifies the deployed Vercel/Render integration without mutating production assessment data.

## Commit History

The repository contains **20+ meaningful frontend commits** covering architecture, auth, UI, candidate workflows, reviewer workflows, admin workflows, payments, validation, QA and deployment.

## Video Submission

See `docs/VIDEO_WALKTHROUGH.md` for a 5–10 minute walkthrough outline. The actual screen recording must be recorded and submitted by the project owner.
