import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { ReviewerAssessmentList } from "@/components/reviewer/reviewer-assessment-list";
import { PageSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Reviewer Assessments",
  description: "Search and manage assessments authored by the signed-in reviewer.",
};

export default function ReviewerAssessmentsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><p className="text-sm font-semibold text-[var(--primary)]">Reviewer</p><h1 className="mt-1 text-3xl font-bold">My assessments</h1><p className="mt-2 text-[var(--muted)]">Filters and pagination are synchronized to the URL.</p></div>
        <Link href="/reviewer/assessments/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16} /> New assessment</Link>
      </div>
      <Suspense fallback={<PageSkeleton />}><ReviewerAssessmentList /></Suspense>
    </main>
  );
}
