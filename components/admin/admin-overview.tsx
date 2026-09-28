"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Activity, ClipboardList, CreditCard, FileClock, UsersRound } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import type { AdminStats, ApiResponse } from "@/types";

export function AdminOverview() {
  const query = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiRequest<ApiResponse<AdminStats>>("/admin/stats", { auth: true }),
  });

  const stats = query.data?.data;
  const userData = [
    { name: "Candidates", value: stats?.users.candidates ?? 0 },
    { name: "Reviewers", value: stats?.users.reviewers ?? 0 },
    { name: "Other/Admin", value: Math.max(0, (stats?.users.total ?? 0) - (stats?.users.candidates ?? 0) - (stats?.users.reviewers ?? 0)) },
  ];
  const workflowData = [
    { name: "Published", value: stats?.assessments.published ?? 0 },
    { name: "Attempts", value: stats?.attempts.total ?? 0 },
    { name: "Evaluated", value: stats?.attempts.evaluated ?? 0 },
    { name: "Payments", value: stats?.payments.successfulCount ?? 0 },
  ];

  if (query.error) {
    return <p className="mt-8 rounded-xl bg-red-500/10 p-4 text-sm text-red-600">{query.error instanceof Error ? query.error.message : "Unable to load admin statistics"}</p>;
  }

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UsersRound} label="Users" value={stats?.users.total ?? "—"} detail={`${stats?.users.candidates ?? 0} candidates · ${stats?.users.reviewers ?? 0} reviewers`} />
        <StatCard icon={ClipboardList} label="Published assessments" value={stats?.assessments.published ?? "—"} detail="Visible in the public catalog" />
        <StatCard icon={Activity} label="Attempts" value={stats?.attempts.total ?? "—"} detail={`${stats?.attempts.evaluated ?? 0} evaluated`} />
        <StatCard icon={CreditCard} label="Successful payments" value={stats?.payments.successfulCount ?? "—"} detail={`${((stats?.payments.grossAmountInMinorUnits ?? 0) / 100).toFixed(2)} gross amount`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="User distribution" description="Current active role distribution." data={userData} />
        <ChartCard title="Workflow activity" description="Live platform counts from the admin statistics endpoint." data={workflowData} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/users"><Card className="h-full transition hover:border-[var(--primary)]"><UsersRound className="text-[var(--primary)]" /><h2 className="mt-4 font-bold">Manage users</h2><p className="mt-2 text-sm text-[var(--muted)]">Search, filter, update roles/statuses and soft-delete eligible accounts.</p></Card></Link>
        <Link href="/admin/audit"><Card className="h-full transition hover:border-[var(--primary)]"><FileClock className="text-[var(--primary)]" /><h2 className="mt-4 font-bold">Audit logs</h2><p className="mt-2 text-sm text-[var(--muted)]">Inspect security-sensitive actions recorded by the backend.</p></Card></Link>
      </div>
    </>
  );
}

function ChartCard({ title, description, data }: { title: string; description: string; data: Array<{ name: string; value: number }> }) {
  return (
    <Card>
      <h2 className="font-bold">{title}</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
