"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckSquare, ClipboardList, CreditCard, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiResponse, Attempt } from "@/types";

export function CandidateDashboard() {
  const { user } = useAuth();
  const attempts = useQuery({
    queryKey: ["candidate-dashboard-attempts"],
    queryFn: () => apiRequest<ApiResponse<Attempt[]>>("/attempts/my?page=1&limit=5", { auth: true }),
  });

  const items = attempts.data?.data ?? [];
  const evaluated = items.filter((attempt) => attempt.status === "EVALUATED").length;
  const active = items.filter((attempt) => ["READY", "IN_PROGRESS", "PENDING_PAYMENT"].includes(attempt.status)).length;

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-[var(--primary)]">Candidate dashboard</p>
          <h1 className="mt-1 text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="mt-2 text-[var(--muted)]">Continue your assessment journey from one place.</p>
        </div>
        <Badge tone="blue">CANDIDATE</Badge>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Metric label="Recent attempts" value={attempts.data?.meta?.total ?? items.length} />
        <Metric label="Active" value={active} />
        <Metric label="Evaluated" value={evaluated} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Quick href="/assessments" icon={ClipboardList} title="Browse assessments" text="Search the live assessment catalog." />
        <Quick href="/attempts" icon={CheckSquare} title="My attempts" text="Pay, start or continue an attempt." />
        <Quick href="/dashboard/payments" icon={CreditCard} title="Payments" text="Review assessment payment status." />
        <Quick href="/dashboard/profile" icon={UserRound} title="Profile" text="Update your name and profile image." />
      </div>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div><h2 className="text-xl font-bold">Recent activity</h2><p className="mt-1 text-sm text-[var(--muted)]">Your latest assessment attempts.</p></div>
          <Link href="/attempts" className="text-sm font-semibold text-[var(--primary)]">View all</Link>
        </div>

        <div className="mt-4 grid gap-3">
          {attempts.isLoading ? Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-20 w-full" />) : null}
          {items.map((attempt) => (
            <Link href={`/attempts/${attempt.id}`} key={attempt.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-[var(--primary)] sm:flex-row sm:items-center">
              <div><p className="font-semibold">{attempt.assessment.title}</p><p className="mt-1 text-sm text-[var(--muted)]">Attempt #{attempt.attemptNo}</p></div>
              <div className="flex items-center gap-3"><Badge>{attempt.status.replaceAll("_", " ")}</Badge><ArrowRight size={17} /></div>
            </Link>
          ))}
          {!attempts.isLoading && items.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No activity yet" description="Enroll in a published assessment to create your first attempt." action={<Link href="/assessments" className="text-sm font-semibold text-[var(--primary)]">Browse assessments →</Link>} />
          ) : null}
        </div>
      </section>
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <Card><p className="text-sm font-semibold text-[var(--muted)]">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></Card>;
}

function Quick({ href, icon: Icon, title, text }: { href: string; icon: typeof ClipboardList; title: string; text: string }) {
  return <Link href={href}><Card className="h-full transition hover:-translate-y-0.5 hover:border-[var(--primary)]"><Icon size={21} className="text-[var(--primary)]" /><h2 className="mt-4 font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></Card></Link>;
}
