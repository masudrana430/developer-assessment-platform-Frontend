import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about DevAssess assessments, payments, reviews and roles.",
};

const faqs = [
  ["Who can take assessments?", "Only Candidate accounts can enroll, pay for and start assessment attempts."],
  ["How are payments handled?", "Paid assessments use Stripe Checkout in test mode. The backend confirms payment through Stripe webhooks before an attempt becomes ready."],
  ["How are answers scored?", "MCQ answers are scored automatically. TEXT and CODE responses can be scored by an assigned Reviewer."],
  ["Can two reviewers claim the same submission?", "No. The backend uses an atomic claim operation so a submitted attempt can only be assigned once."],
  ["What can Admins do?", "Admins can inspect statistics, search users, update roles and statuses, soft-delete eligible accounts and review audit logs."],
  ["Does the frontend use mock data?", "No core workflow uses mock data. Assessment, attempt, payment, review and admin data comes from the deployed backend API."],
] as const;

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">FAQ</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Frequently asked questions</h1>
      <div className="mt-8 grid gap-3">
        {faqs.map(([question, answer]) => (
          <Card key={question}>
            <h2 className="font-bold">{question}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{answer}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
