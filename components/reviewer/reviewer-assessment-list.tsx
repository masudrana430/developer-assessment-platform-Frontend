"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Plus } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryState } from "@/hooks/use-query-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import type { ApiResponse, Assessment } from "@/types";

export function ReviewerAssessmentList() {
  const { searchParams, setQuery } = useQueryState();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const status = searchParams.get("status") ?? "";
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debounced = useDebounce(search);

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (debounced !== current) setQuery({ search: debounced || null }, true);
  }, [debounced, searchParams, setQuery]);

  const query = useQuery({
    queryKey: ["reviewer-assessments", page, status, debounced],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: "9" });
      if (status) params.set("status", status);
      if (debounced) params.set("search", debounced);
      return apiRequest<ApiResponse<Assessment[]>>(`/assessments/manage/mine?${params.toString()}`, { auth: true });
    },
  });

  return (
    <>
      <div className="mt-6 grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:grid-cols-[1fr_180px]">
        <SearchInput value={search} onChange={setSearch} placeholder="Search my assessments" />
        <Select value={status} onChange={(event) => setQuery({ status: event.target.value || null }, true)}>
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </Select>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {query.data?.data.map((assessment) => (
          <Card key={assessment.id} className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-2"><Badge tone="blue">{assessment.difficulty}</Badge><Badge>{assessment.status}</Badge></div>
            <h2 className="mt-4 text-lg font-bold">{assessment.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{assessment.description}</p>
            <p className="mt-4 text-xs text-[var(--muted)]">{assessment._count?.questions ?? 0} questions · {assessment.durationMinutes} min</p>
            <Link className="mt-auto pt-5 text-sm font-semibold text-[var(--primary)]" href={`/reviewer/assessments/${assessment.id}`}>Manage assessment →</Link>
          </Card>
        ))}
      </div>

      {!query.isLoading && query.data?.data.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={ClipboardList} title="No assessments found" description="Create an assessment or change the current filters." action={<Link href="/reviewer/assessments/new" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"><Plus size={15} /> New assessment</Link>} />
        </div>
      ) : null}

      {query.data?.meta && query.data.meta.totalPages > 1 ? (
        <div className="mt-8 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
          <button className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-40" disabled={page <= 1} onClick={() => setQuery({ page: page - 1 })}>Previous</button>
          <span className="text-sm text-[var(--muted)]">Page {query.data.meta.page} of {query.data.meta.totalPages}</span>
          <button className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-40" disabled={page >= query.data.meta.totalPages} onClick={() => setQuery({ page: page + 1 })}>Next</button>
        </div>
      ) : null}
    </>
  );
}
