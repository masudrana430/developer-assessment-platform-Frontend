"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import type { ApiResponse, Assessment } from "@/types";

export default function AssessmentsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["assessments"],
    queryFn: () =>
      apiRequest<ApiResponse<{ data?: Assessment[]; items?: Assessment[] } | Assessment[]>>(
        "/assessments?page=1&limit=12&sortBy=createdAt&sortOrder=desc",
      ),
  });

  const payload = data?.data;
  const assessments = Array.isArray(payload)
    ? payload
    : payload?.data ?? payload?.items ?? [];

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Published Assessments</h1>
        <p className="mt-2 text-slate-600">Public assessment listing from your backend API.</p>
      </div>

      {isLoading && <p>Loading assessments...</p>}
      {error && <p className="text-red-600">{error instanceof Error ? error.message : "Failed to load"}</p>}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {assessments.map((assessment) => (
          <Card key={assessment.id}>
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {assessment.difficulty}
              </span>
              <span className="text-xs text-slate-500">{assessment.durationMinutes} min</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold">{assessment.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{assessment.description}</p>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Pass: {assessment.passingScore}%</span>
              <span className="font-semibold text-blue-700">
                {assessment.feeCents > 0
                  ? `${(assessment.feeCents / 100).toFixed(2)} ${assessment.currency.toUpperCase()}`
                  : "Free"}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
