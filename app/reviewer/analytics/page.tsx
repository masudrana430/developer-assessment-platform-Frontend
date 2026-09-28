import type { Metadata } from "next";
import { ReviewerAnalytics } from "@/components/reviewer/reviewer-analytics";

export const metadata: Metadata = {
  title: "Reviewer Analytics",
  description: "Reviewer workload and outcome analytics calculated from real assigned reviews.",
};

export default function ReviewerAnalyticsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Reviewer analytics</p>
      <h1 className="mt-1 text-3xl font-bold">Review performance</h1>
      <p className="mt-2 text-[var(--muted)]">A live summary of your assigned and evaluated submissions.</p>
      <ReviewerAnalytics />
    </main>
  );
}
