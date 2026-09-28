import type { Metadata } from "next";
import { Suspense } from "react";
import { AssessmentCatalog } from "@/components/assessments/assessment-catalog";
import { PageSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Assessments",
  description: "Browse real published developer assessments with URL-synchronized search, filtering, sorting and pagination.",
};

export default function AssessmentsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Published catalog</p>
      <h1 className="mt-2 text-3xl font-bold">Assessments</h1>
      <p className="mt-2 max-w-2xl text-[var(--muted)]">Search and share filtered views of the live assessment catalog.</p>
      <Suspense fallback={<PageSkeleton />}>
        <AssessmentCatalog />
      </Suspense>
    </main>
  );
}
