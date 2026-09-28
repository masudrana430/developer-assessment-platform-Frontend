"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useQueryState } from "@/hooks/use-query-state";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
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

export function AttemptList() {
  const { searchParams, setQuery } = useQueryState();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const status = searchParams.get("status") ?? "";

  const query = useQuery({
    queryKey: ["my-attempts", page, status],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (status) params.set("status", status);
      return apiRequest<ApiResponse<Attempt[]>>(`/attempts/my?${params.toString()}`, { auth: true });
    },
  });

  return (
    <>
      <div className="mt-6 flex justify-end">
        <Select className="sm:w-64" value={status} onChange={(event) => setQuery({ status: event.target.value || null }, true)}>
          <option value="">All statuses</option>
          {statuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
        </Select>
      </div>

      {query.error ? <p className="mt-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-600">{query.error instanceof Error ? query.error.message : "Unable to load attempts"}</p> : null}

      <div className="mt-6 grid gap-4">
        {query.data?.data.map((attempt) => (
          <Card key={attempt.id} className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{attempt.assessment.title}</h2><StatusBadge status={attempt.status} /></div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Attempt #{attempt.attemptNo} · {attempt.assessment.difficulty ?? "Assessment"}{attempt.finalScore != null ? ` · Score ${attempt.finalScore}%` : ""}
              </p>
              {attempt.payment ? <p className="mt-2 text-xs text-[var(--muted)]">Payment: {attempt.payment.status}</p> : null}
            </div>
            <Link href={`/attempts/${attempt.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--muted-bg)]">
              Open attempt <ArrowRight size={16} />
            </Link>
          </Card>
        ))}
      </div>

      {!query.isLoading && query.data?.data.length === 0 ? (
        <div className="mt-8"><EmptyState icon={ClipboardCheck} title="No attempts found" description="Change the status filter or enroll in a published assessment." action={<Link href="/assessments" className="text-sm font-semibold text-[var(--primary)]">Browse assessments →</Link>} /></div>
      ) : null}

      {query.data?.meta && query.data.meta.totalPages > 1 ? (
        <nav className="mt-6 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3" aria-label="Attempt pagination">
          <button className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-40" disabled={page <= 1} onClick={() => setQuery({ page: page - 1 })}>Previous</button>
          <span className="text-sm text-[var(--muted)]">Page {query.data.meta.page} of {query.data.meta.totalPages}</span>
          <button className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-40" disabled={page >= query.data.meta.totalPages} onClick={() => setQuery({ page: page + 1 })}>Next</button>
        </nav>
      ) : null}
    </>
  );
}
