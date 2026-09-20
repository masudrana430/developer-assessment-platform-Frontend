# Developer Assessment Platform Frontend

Full responsive frontend for the Developer Assessment Platform backend.

## Stack

- Next.js 15 App Router
- TypeScript
- React 19
- Tailwind CSS 4
- TanStack Query
- Lucide React

## Backend

Production API:

```text
https://developer-assessment-platform.onrender.com/api/v1
```

Configure:

```env
NEXT_PUBLIC_API_BASE_URL=https://developer-assessment-platform.onrender.com/api/v1
```

## Features

### Public
- Responsive landing page
- Light / dark theme toggle with saved preference
- Assessment catalog with search, difficulty filter and sorting
- Assessment detail page
- Candidate registration and login
- Responsive navigation

### Candidate
- Role-protected dashboard
- Enrollment
- Stripe Checkout redirect
- Attempt list and status filtering
- Timed assessment execution
- MCQ / text / code answer saving
- Final submission
- Review waiting state
- Evaluated score, pass/fail and reviewer feedback
- Profile editing and avatar upload

### Reviewer
- Reviewer dashboard
- Managed assessment list
- Create assessment
- Add MCQ / TEXT / CODE questions
- Publish assessment
- Review queue
- Atomic claim workflow
- Subjective-answer grading
- Final evaluation and overall feedback

### Admin
- Dashboard statistics
- User search / role / status filtering
- Role changes
- Block / activate users
- Soft delete users
- Audit-log viewer and action filter

## Local setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Candidate | candidate@devassess.com | Candidate123! |
| Reviewer | reviewer@devassess.com | Reviewer123! |
| Admin | admin@devassess.com | Admin123! |

## Routes

- `/`
- `/login`
- `/register`
- `/assessments`
- `/assessments/[id]`
- `/dashboard`
- `/profile`
- `/attempts`
- `/attempts/[id]`
- `/reviewer`
- `/reviewer/assessments/new`
- `/reviewer/assessments/[id]`
- `/reviewer/reviews/[id]`
- `/admin`

## Authentication note

This assignment frontend stores access/refresh tokens in localStorage and refreshes expired access tokens through the backend refresh endpoint. For a production security model, an HttpOnly-cookie/BFF design is preferable.
