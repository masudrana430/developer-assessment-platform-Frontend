import type { Metadata } from "next";
import { AssessmentWizard } from "@/components/reviewer/assessment-wizard";

export const metadata: Metadata = {
  title: "Create Assessment",
  description: "Create a developer assessment with a validated multi-step reviewer workflow.",
};

export default function NewAssessmentPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Reviewer</p>
      <h1 className="mt-1 text-3xl font-bold">Create assessment</h1>
      <p className="mt-2 text-[var(--muted)]">Complete the multi-step form, then add questions before publishing.</p>
      <AssessmentWizard />
    </main>
  );
}
