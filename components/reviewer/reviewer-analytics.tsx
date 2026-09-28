"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, CheckCircle2, Clock3, Trophy } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { apiRequest } from "@/lib/api";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import type { ApiResponse, Attempt } from "@/types";

export function ReviewerAnalytics() {
  const query = useQuery({
    queryKey: ["reviewer-analytics"],
    queryFn: () => apiRequest<ApiResponse<Attempt[]>>("/reviews/mine?page=1&limit=100", { auth: true }),
  });

  const rows = query.data?.data ?? [];
  const evaluated = rows.filter((item) => item.status === "EVALUATED");
  const underReview = rows.filter((item) => item.status === "UNDER_REVIEW");
  const passed = evaluated.filter((item) => item.passed).length;
  const average = evaluated.length
    ? Math.round((evaluated.reduce((sum, item) => sum + (item.finalScore ?? 0), 0) / evaluated.length) * 100) / 100
    : 0;

  const chartData = [
    { name: "Under review", value: underReview.length },
    { name: "Evaluated", value: evaluated.length },
    { name: "Passed", value: passed },
    { name: "Failed", value: Math.max(0, evaluated.length - passed) },
  ];

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BarChart3} label="Assigned reviews" value={rows.length} />
        <StatCard icon={Clock3} label="Under review" value={underReview.length} />
        <StatCard icon={CheckCircle2} label="Evaluated" value={evaluated.length} />
        <StatCard icon={Trophy} label="Average score" value={`${average}%`} />
      </div>
      <Card className="mt-6">
        <h2 className="font-bold">Review outcomes</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Calculated from your real assigned review records.</p>
        <div className="mt-6 h-72 w-full" aria-label="Reviewer outcome chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
}
