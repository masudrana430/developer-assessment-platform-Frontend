# Developer Assessment Platform Frontend

A base frontend for the existing Developer Assessment Platform backend.

## Stack

- Next.js (App Router)
- TypeScript
- React 19
- Tailwind CSS 4
- TanStack Query
- Lucide React

## Backend

Default production API:

```text
https://developer-assessment-platform.onrender.com/api/v1
```

Configure with:

```env
NEXT_PUBLIC_API_BASE_URL=https://developer-assessment-platform.onrender.com/api/v1
```

## Included base pages

- `/` — landing page
- `/login` — email/password login
- `/assessments` — public assessment list
- `/dashboard` — authenticated profile dashboard

The login page stores the access/refresh token in localStorage for this starter frontend. For a production frontend, prefer secure HttpOnly cookies managed by your server/BFF layer.

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

## Demo account

```text
Candidate: candidate@devassess.com
Password: Candidate123!
```

## GitHub push

```bash
git init
git add .
git commit -m "feat: initialize Next.js frontend"
git branch -M main
git remote add origin https://github.com/masudrana430/developer-assessment-platform-Frontend.git
git push -u origin main
```

If `origin` already exists:

```bash
git remote set-url origin https://github.com/masudrana430/developer-assessment-platform-Frontend.git
git push -u origin main
```

## Suggested next pages

- Candidate assessment details + enrollment
- Stripe Checkout redirect page
- Attempt execution UI with timer
- Reviewer assessment management
- Reviewer grading queue
- Admin users/stats/audit logs
- Role-based navigation and route guards
