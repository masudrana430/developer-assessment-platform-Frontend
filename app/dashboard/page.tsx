"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, CheckSquare, UserRound, Shield, ArrowRight } from "lucide-react";
import { RequireAuth } from "@/components/guard";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ApiResponse, Attempt } from "@/types";

export default function DashboardPage() {
  return <RequireAuth><DashboardContent /></RequireAuth>;
}

function DashboardContent() {
  const { user } = useAuth();
  const attempts = useQuery({
    queryKey: ["dashboard-attempts"],
    enabled: user?.role === "CANDIDATE",
    queryFn: () => apiRequest<ApiResponse<Attempt[]>>("/attempts/my?page=1&limit=5", { auth: true }),
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><p className="text-sm font-semibold text-[var(--primary)]">Overview</p><h1 className="mt-1 text-3xl font-bold">Welcome, {user?.name}</h1><p className="mt-2 text-[var(--muted)]">Your account is ready for the next task.</p></div>
        <Badge tone="blue">{user?.role}</Badge>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Quick href="/assessments" icon={ClipboardList} title="Browse assessments" text="Explore published assessments." />
        {user?.role === "CANDIDATE" && <Quick href="/attempts" icon={CheckSquare} title="My attempts" text="Continue paid, active or reviewed attempts." />}
        {user?.role === "REVIEWER" && <Quick href="/reviewer" icon={CheckSquare} title="Reviewer workspace" text="Manage assessments and grade submissions." />}
        {user?.role === "ADMIN" && <Quick href="/admin" icon={Shield} title="Admin console" text="Users, statistics and audit history." />}
        <Quick href="/profile" icon={UserRound} title="Profile" text="Update your display name and avatar." />
      </div>

      {user?.role === "CANDIDATE" && (
        <section className="mt-10">
          <div className="flex items-end justify-between"><div><h2 className="text-xl font-bold">Recent attempts</h2><p className="mt-1 text-sm text-[var(--muted)]">Your latest assessment activity.</p></div><Link href="/attempts" className="text-sm font-semibold text-[var(--primary)]">See all</Link></div>
          <div className="mt-4 grid gap-3">
            {attempts.data?.data.map((attempt) => (
              <Link href={`/attempts/${attempt.id}`} key={attempt.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-[var(--primary)] sm:flex-row sm:items-center">
                <div><p className="font-semibold">{attempt.assessment.title}</p><p className="mt-1 text-sm text-[var(--muted)]">Attempt #{attempt.attemptNo}</p></div>
                <div className="flex items-center gap-3"><Badge>{attempt.status}</Badge><ArrowRight size={17} /></div>
              </Link>
            ))}
            {!attempts.isLoading && attempts.data?.data.length === 0 && <Card><p className="text-sm text-[var(--muted)]">You have not enrolled in an assessment yet.</p></Card>}
          </div>
        </section>
      )}
    </main>
  );
}

function Quick({ href, icon: Icon, title, text }: { href: string; icon: typeof ClipboardList; title: string; text: string }) {
  return <Link href={href}><Card className="h-full transition hover:-translate-y-0.5 hover:border-[var(--primary)]"><Icon size={21} className="text-[var(--primary)]" /><h2 className="mt-4 font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></Card></Link>;
}
