"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock3, CircleDollarSign, ClipboardList } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryState } from "@/hooks/use-query-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiResponse, Assessment } from "@/types";

export function AssessmentCatalog() {
  const { searchParams, setQuery } = useQueryState();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const difficulty = searchParams.get("difficulty") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (debouncedSearch !== current) setQuery({ search: debouncedSearch || null }, true);
  }, [debouncedSearch, searchParams, setQuery]);

  const query = useQuery({
    queryKey: ["assessments", page, debouncedSearch, difficulty, sortBy, sortOrder],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: "9",
        sortBy,
        sortOrder,
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (difficulty) params.set("difficulty", difficulty);
      return apiRequest<ApiResponse<Assessment[]>>(`/assessments?${params.toString()}`);
    },
  });

  const meta = query.data?.meta;

  return (
    <>
      <div className="mt-8 grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 md:grid-cols-[1fr_180px_180px_150px]">
        <SearchInput value={search} onChange={setSearch} placeholder="Search assessments" />
        <Select value={difficulty} onChange={(event) => setQuery({ difficulty: event.target.value || null }, true)}>
          <option value="">All levels</option>
          <option value="JUNIOR">Junior</option>
          <option value="MID">Mid</option>
          <option value="SENIOR">Senior</option>
        </Select>
        <Select value={sortBy} onChange={(event) => setQuery({ sortBy: event.target.value }, true)}>
          <option value="createdAt">Newest</option>
          <option value="title">Title</option>
          <option value="feeCents">Price</option>
          <option value="durationMinutes">Duration</option>
        </Select>
        <Select value={sortOrder} onChange={(event) => setQuery({ sortOrder: event.target.value }, true)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </Select>
      </div>

      {query.isLoading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index}><Skeleton className="h-5 w-20" /><Skeleton className="mt-4 h-6 w-4/5" /><Skeleton className="mt-3 h-4 w-full" /><Skeleton className="mt-2 h-4 w-3/4" /><Skeleton className="mt-6 h-10 w-full" /></Card>
          ))}
        </div>
      ) : null}

      {query.error ? (
        <div className="mt-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-600">
          {query.error instanceof Error ? query.error.message : "Unable to load assessments"}
        </div>
      ) : null}

      {!query.isLoading && query.data?.data.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={ClipboardList}
            title="No assessments found"
            description="Try a different search term or remove one of the current filters."
          />
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {query.data?.data.map((assessment) => (
          <Card key={assessment.id} className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3">
              <Badge tone="blue">{assessment.difficulty}</Badge>
              <span className="text-xs text-[var(--muted)]">{assessment._count?.questions ?? 0} questions</span>
            </div>
            <h2 className="mt-4 text-xl font-bold">{assessment.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{assessment.description}</p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
              <span className="inline-flex items-center gap-1.5"><Clock3 size={15} /> {assessment.durationMinutes} min</span>
              <span className="inline-flex items-center gap-1.5"><CircleDollarSign size={15} /> {assessment.feeCents ? `${(assessment.feeCents / 100).toFixed(2)} ${assessment.currency.toUpperCase()}` : "Free"}</span>
            </div>
            <div className="mt-auto pt-6">
              <Link href={`/assessments/${assessment.id}`} className="inline-flex w-full justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white">
                View assessment
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {meta && meta.totalPages > 1 ? (
        <nav className="mt-8 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3" aria-label="Assessment pagination">
          <button
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setQuery({ page: page - 1 })}
          >
            Previous
          </button>
          <span className="text-sm text-[var(--muted)]">Page {meta.page} of {meta.totalPages}</span>
          <button
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-40"
            disabled={page >= meta.totalPages}
            onClick={() => setQuery({ page: page + 1 })}
          >
            Next
          </button>
        </nav>
      ) : null}
    </>
  );
}
