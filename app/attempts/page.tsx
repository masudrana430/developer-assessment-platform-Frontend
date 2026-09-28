import type { Metadata } from "next";
import { Suspense } from "react";
import { AttemptList } from "@/components/candidate/attempt-list";
import { PageSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "My Attempts",
  description: "Candidate assessment attempts with URL-synchronized status filtering and pagination.",
};

export default function AttemptsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Candidate workspace</p>
      <h1 className="mt-1 text-3xl font-bold">My attempts</h1>
      <p className="mt-2 text-[var(--muted)]">Pay, start, continue and review your assessment attempts.</p>
      <Suspense fallback={<PageSkeleton />}><AttemptList /></Suspense>
    </main>
  );
}
