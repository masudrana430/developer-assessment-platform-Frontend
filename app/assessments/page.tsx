"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Clock3, CircleDollarSign } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { ApiResponse, Assessment } from "@/types";

export default function AssessmentsPage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const query = useQuery({
    queryKey: ["assessments", search, difficulty, sortBy],
    queryFn: () => {
      const params = new URLSearchParams({ page: "1", limit: "50", sortBy, sortOrder: "desc" });
      if (search.trim()) params.set("search", search.trim());
      if (difficulty) params.set("difficulty", difficulty);
      return apiRequest<ApiResponse<Assessment[]>>(`/assessments?${params.toString()}`);
    },
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-[var(--primary)]">Published catalog</p>
          <h1 className="mt-2 text-3xl font-bold">Assessments</h1>
          <p className="mt-2 text-[var(--muted)]">Choose a developer assessment that matches your level.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 md:w-[620px]">
          <div className="relative sm:col-span-1"><Search className="absolute left-3 top-3 text-[var(--muted)]" size={16} /><Input className="pl-9" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option value="">All levels</option><option value="JUNIOR">Junior</option><option value="MID">Mid</option><option value="SENIOR">Senior</option></Select>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="createdAt">Newest</option><option value="title">Title</option><option value="feeCents">Price</option><option value="durationMinutes">Duration</option></Select>
        </div>
      </div>

      {query.isLoading && <p className="mt-10 text-[var(--muted)]">Loading assessments...</p>}
      {query.error && <p className="mt-10 rounded-xl bg-red-500/10 p-4 text-red-600">{query.error instanceof Error ? query.error.message : "Unable to load assessments"}</p>}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
              <Link href={`/assessments/${assessment.id}`} className="inline-flex w-full justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white">View assessment</Link>
            </div>
          </Card>
        ))}
      </div>

      {!query.isLoading && query.data?.data.length === 0 && <div className="mt-12 rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-[var(--muted)]">No assessments match your filters.</div>}
    </main>
  );
}
