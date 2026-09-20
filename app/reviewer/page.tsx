"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ArrowRight, Inbox, ClipboardCheck, Layers3 } from "lucide-react";
import { RequireAuth } from "@/components/guard";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import type { ApiResponse, Assessment, Attempt } from "@/types";

export default function ReviewerPage() {
  return <RequireAuth roles={["REVIEWER"]}><ReviewerContent /></RequireAuth>;
}

function ReviewerContent() {
  const queryClient = useQueryClient();
  const managed = useQuery({
    queryKey: ["reviewer-managed"],
    queryFn: () => apiRequest<ApiResponse<Assessment[]>>("/assessments/manage/mine?page=1&limit=50", { auth: true }),
  });
  const queue = useQuery({
    queryKey: ["review-queue"],
    queryFn: () => apiRequest<ApiResponse<Attempt[]>>("/reviews/queue?page=1&limit=50", { auth: true }),
  });
  const mine = useQuery({
    queryKey: ["review-mine"],
    queryFn: () => apiRequest<ApiResponse<Attempt[]>>("/reviews/mine?page=1&limit=50", { auth: true }),
  });

  const claim = useMutation({
    mutationFn: (attemptId: string) => apiRequest<ApiResponse<Attempt>>(`/reviews/${attemptId}/claim`, { method: "POST", auth: true }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["review-queue"] });
      void queryClient.invalidateQueries({ queryKey: ["review-mine"] });
    },
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div><p className="text-sm font-semibold text-[var(--primary)]">Reviewer workspace</p><h1 className="mt-1 text-3xl font-bold">Assessments & reviews</h1><p className="mt-2 text-[var(--muted)]">Create assessments, publish content and evaluate candidate submissions.</p></div>
        <Link href="/reviewer/assessments/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17} /> New assessment</Link>
      </div>

      <section className="mt-10">
        <SectionTitle icon={Layers3} title="My assessments" text="Draft, published and archived assessment content." />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {managed.data?.data.map((assessment) => (
            <Card key={assessment.id} className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-2"><Badge tone="blue">{assessment.difficulty}</Badge><Badge>{assessment.status}</Badge></div>
              <h2 className="mt-4 text-lg font-bold">{assessment.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{assessment.description}</p>
              <p className="mt-4 text-xs text-[var(--muted)]">{assessment._count?.questions ?? 0} questions · {assessment.durationMinutes} min</p>
              <Link href={`/reviewer/assessments/${assessment.id}`} className="mt-auto pt-5 text-sm font-semibold text-[var(--primary)]">Manage assessment →</Link>
            </Card>
          ))}
          {!managed.isLoading && managed.data?.data.length === 0 && <Card><p className="text-sm text-[var(--muted)]">You have not created an assessment yet.</p></Card>}
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle icon={Inbox} title="Review queue" text="Submitted attempts that have not been claimed." />
        <div className="mt-4 grid gap-3">
          {queue.data?.data.map((attempt) => (
            <Card key={attempt.id} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div><h3 className="font-bold">{attempt.assessment.title}</h3><p className="mt-1 text-sm text-[var(--muted)]">{attempt.candidate?.name ?? "Candidate"} · Attempt #{attempt.attemptNo}</p></div>
              <Button disabled={claim.isPending} onClick={() => claim.mutate(attempt.id)}>{claim.isPending ? "Claiming..." : "Claim review"}</Button>
            </Card>
          ))}
          {!queue.isLoading && queue.data?.data.length === 0 && <Card><p className="text-sm text-[var(--muted)]">Nothing is waiting in the review queue.</p></Card>}
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle icon={ClipboardCheck} title="My assigned reviews" text="Submissions you have claimed or already evaluated." />
        <div className="mt-4 grid gap-3">
          {mine.data?.data.map((attempt) => (
            <Link href={`/reviewer/reviews/${attempt.id}`} key={attempt.id}>
              <Card className="flex flex-col justify-between gap-4 transition hover:border-[var(--primary)] sm:flex-row sm:items-center">
                <div><h3 className="font-bold">{attempt.assessment.title}</h3><p className="mt-1 text-sm text-[var(--muted)]">{attempt.candidate?.name ?? "Candidate"}{attempt.finalScore != null ? ` · ${attempt.finalScore}%` : ""}</p></div>
                <div className="flex items-center gap-3"><StatusBadge status={attempt.status} /><ArrowRight size={17} /></div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function SectionTitle({ icon: Icon, title, text }: { icon: typeof Inbox; title: string; text: string }) {
  return <div className="flex items-start gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--muted-bg)] text-[var(--primary)]"><Icon size={18} /></span><div><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-[var(--muted)]">{text}</p></div></div>;
}
