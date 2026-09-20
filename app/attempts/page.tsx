"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { RequireAuth } from "@/components/guard";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import type { ApiResponse, Attempt, AttemptStatus } from "@/types";

const statuses: AttemptStatus[] = [
  "PENDING_PAYMENT",
  "READY",
  "IN_PROGRESS",
  "SUBMITTED",
  "UNDER_REVIEW",
  "EVALUATED",
  "CANCELLED",
];

export default function AttemptsPage() {
  return <RequireAuth roles={["CANDIDATE"]}><AttemptsContent /></RequireAuth>;
}

function AttemptsContent() {
  const [status, setStatus] = useState("");
  const query = useQuery({
    queryKey: ["my-attempts", status],
    queryFn: () => {
      const params = new URLSearchParams({ page: "1", limit: "50" });
      if (status) params.set("status", status);
      return apiRequest<ApiResponse<Attempt[]>>(`/attempts/my?${params.toString()}`, { auth: true });
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[var(--primary)]">Candidate workspace</p>
          <h1 className="mt-1 text-3xl font-bold">My attempts</h1>
          <p className="mt-2 text-[var(--muted)]">Pay, start, continue and review your assessment attempts.</p>
        </div>
        <Select className="sm:w-56" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
        </Select>
      </div>

      <div className="mt-8 grid gap-4">
        {query.isLoading && <p className="text-[var(--muted)]">Loading your attempts...</p>}
        {query.error && <p className="rounded-xl bg-red-500/10 p-4 text-red-600">{query.error instanceof Error ? query.error.message : "Unable to load attempts"}</p>}
        {query.data?.data.map((attempt) => (
          <Card key={attempt.id} className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold">{attempt.assessment.title}</h2>
                <StatusBadge status={attempt.status} />
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Attempt #{attempt.attemptNo} · {attempt.assessment.difficulty ?? "Assessment"}
                {attempt.finalScore != null ? ` · Score ${attempt.finalScore}%` : ""}
              </p>
              {attempt.payment && <p className="mt-2 text-xs text-[var(--muted)]">Payment: {attempt.payment.status}</p>}
            </div>
            <Link href={`/attempts/${attempt.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--muted-bg)]">
              Open attempt <ArrowRight size={16} />
            </Link>
          </Card>
        ))}
      </div>

      {!query.isLoading && query.data?.data.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
          <ClipboardCheck className="mx-auto text-[var(--muted)]" />
          <h2 className="mt-4 font-bold">No attempts yet</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Browse the catalog and enroll in your first assessment.</p>
          <Link href="/assessments" className="mt-5 inline-flex rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white">Browse assessments</Link>
        </div>
      )}
    </main>
  );
}
