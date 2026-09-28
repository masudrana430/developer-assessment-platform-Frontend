# 5–10 Minute Demo Video Walkthrough

Use the deployed frontend:

https://developer-assessment-platform-front.vercel.app

## 0:00–0:45 — Introduction
- Show the landing page on desktop.
- Toggle light/dark theme.
- Resize to mobile width and open the responsive navigation.
- Mention Next.js App Router, Tailwind CSS and Radix UI.

## 0:45–1:30 — Public pages and URL state
- Open About, Features, Pricing and FAQ.
- Open Assessments.
- Search, filter by difficulty and change sorting.
- Point out that the URL query string changes.
- Open a real assessment detail page.

## 1:30–2:20 — Authentication
- Open Login.
- Show the three one-click Demo Login cards.
- Use Candidate Demo Login.
- Explain that Next.js route handlers set HttpOnly cookies and middleware protects role routes.

## 2:20–4:00 — Candidate workflow
- Show Candidate dashboard.
- Open My Attempts and filter by status.
- Show Profile & Settings and Cloudinary avatar upload.
- Show Payment History.
- Open a paid assessment and explain:
  enrollment -> Stripe Checkout -> webhook -> READY.
- If using Stripe test mode during recording, complete a test payment and show the frontend success page.
- Start an attempt, save an answer, and submit only if you have a disposable demo attempt.

## 4:00–5:45 — Reviewer workflow
- Logout and one-click Reviewer Demo Login.
- Show Reviewer dashboard and review queue.
- Open My Assessments with URL search/status filters.
- Open Create Assessment and demonstrate the 3-step RHF + Zod wizard.
- Open a managed assessment and show question creation.
- Show Reviewer Analytics.
- If a disposable submitted attempt exists, claim it and demonstrate grading.

## 5:45–7:00 — Admin workflow
- Logout and one-click Admin Demo Login.
- Show statistics and charts.
- Open User Management.
- Search/filter users and explain role/status actions.
- Open Audit Logs and filter by action/entity type.

## 7:00–8:00 — Architecture and quality
- Show GitHub repository structure:
  - app/
  - components/
  - hooks/
  - lib/
  - middleware.ts
- Show loading.tsx, error.tsx and not-found.tsx.
- Show GitHub Actions successful typecheck/build.
- Mention 20+ meaningful commits.

## 8:00–8:30 — Deployment
- Show Vercel production URL.
- Show Render backend health endpoint and Swagger docs.
- End by summarizing Candidate, Reviewer and Admin roles.

## Important
Do not expose Stripe secret keys, JWT secrets, database URLs, Cloudinary secrets or webhook signing secrets in the recording.
