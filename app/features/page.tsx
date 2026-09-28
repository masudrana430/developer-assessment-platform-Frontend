import type { Metadata } from "next";
import { BadgeCheck, Clock3, CreditCard, Search, Shield, UserCog } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore the candidate, reviewer and admin capabilities available in DevAssess.",
};

const features = [
  ["Assessment discovery", Search, "Search, filter and sort published assessments with shareable URL state."],
  ["Timed attempts", Clock3, "Start a backend-timed assessment and save answers before final submission."],
  ["Stripe Checkout", CreditCard, "Paid assessments use real Stripe test-mode Checkout and signed webhooks."],
  ["Structured review", BadgeCheck, "MCQs are auto-scored while reviewers grade subjective answers and add feedback."],
  ["Role-based management", UserCog, "Reviewer and Admin screens expose only the actions appropriate to each role."],
  ["Audit-friendly administration", Shield, "Admins can inspect users, platform statistics and audit-log activity."],
] as const;

export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Platform features</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Everything needed for the assessment lifecycle.</h1>
      <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">
        Each feature below is backed by the live Developer Assessment Platform API rather than mock data.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map(([title, Icon, description]) => (
          <Card key={title}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--muted-bg)] text-[var(--primary)]">
              <Icon size={19} />
            </span>
            <h2 className="mt-4 text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
