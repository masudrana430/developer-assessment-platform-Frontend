"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, BarChart3, ClipboardCheck, Inbox, Layers3, Plus, UserRound } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/status-badge";
import type { ApiResponse, Assessment, Attempt } from "@/types";

export function ReviewerOverview() {
  const queryClient = useQueryClient();
  const managed = useQuery({ queryKey: ["reviewer-managed-summary"], queryFn: () => apiRequest<ApiResponse<Assessment[]>>("/assessments/manage/mine?page=1&limit=3", { auth: true }) });
  const queue = useQuery({ queryKey: ["review-queue"], queryFn: () => apiRequest<ApiResponse<Attempt[]>>("/reviews/queue?page=1&limit=10", { auth: true }) });
  const mine = useQuery({ queryKey: ["review-mine"], queryFn: () => apiRequest<ApiResponse<Attempt[]>>("/reviews/mine?page=1&limit=5", { auth: true }) });

  const claim = useMutation({
    mutationFn: (attemptId: string) => apiRequest<ApiResponse<Attempt>>(`/reviews/${attemptId}/claim`, { method: "POST", auth: true }),
    onSuccess: () => {
      toast.success("Submission claimed");
      void queryClient.invalidateQueries({ queryKey: ["review-queue"] });
      void queryClient.invalidateQueries({ queryKey: ["review-mine"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to claim review"),
  });

  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div><p className="text-sm font-semibold text-[var(--primary)]">Reviewer workspace</p><h1 className="mt-1 text-3xl font-bold">Assessments & reviews</h1><p className="mt-2 text-[var(--muted)]">Author assessments, claim submissions and evaluate candidate work.</p></div>
        <Link href="/reviewer/assessments/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17} /> New assessment</Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Quick href="/reviewer/assessments" icon={Layers3} title="My assessments" text="Search and manage authored assessments." />
        <Quick href="/reviewer/analytics" icon={BarChart3} title="Analytics" text="Review outcomes from live API data." />
        <Quick href="/reviewer/profile" icon={UserRound} title="Profile" text="Update your reviewer profile." />
      </div>

      <section className="mt-10">
        <SectionTitle icon={Layers3} title="Recent assessments" text="Your latest authored assessments." action={<Link href="/reviewer/assessments" className="text-sm font-semibold text-[var(--primary)]">View all</Link>} />
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {managed.data?.data.map((assessment) => (
            <Card key={assessment.id} className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-2"><Badge tone="blue">{assessment.difficulty}</Badge><Badge>{assessment.status}</Badge></div>
              <h3 className="mt-4 font-bold">{assessment.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{assessment._count?.questions ?? 0} questions</p>
              <Link className="mt-auto pt-4 text-sm font-semibold text-[var(--primary)]" href={`/reviewer/assessments/${assessment.id}`}>Manage →</Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle icon={Inbox} title="Review queue" text="Submitted attempts not yet claimed." />
        <div className="mt-4 grid gap-3">
          {queue.data?.data.map((attempt) => (
            <Card key={attempt.id} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div><h3 className="font-bold">{attempt.assessment.title}</h3><p className="mt-1 text-sm text-[var(--muted)]">{attempt.candidate?.name ?? "Candidate"} · Attempt #{attempt.attemptNo}</p></div>
              <Button disabled={claim.isPending} onClick={() => claim.mutate(attempt.id)}>{claim.isPending ? "Claiming..." : "Claim review"}</Button>
            </Card>
          ))}
          {!queue.isLoading && queue.data?.data.length === 0 ? <EmptyState icon={Inbox} title="Queue is clear" description="There are no unclaimed submissions right now." /> : null}
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle icon={ClipboardCheck} title="My assigned reviews" text="Submissions you have claimed or evaluated." />
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
    </>
  );
}

function Quick({ href, icon: Icon, title, text }: { href: string; icon: typeof Layers3; title: string; text: string }) {
  return <Link href={href}><Card className="h-full transition hover:border-[var(--primary)]"><Icon size={20} className="text-[var(--primary)]" /><h2 className="mt-4 font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></Card></Link>;
}

function SectionTitle({ icon: Icon, title, text, action }: { icon: typeof Inbox; title: string; text: string; action?: React.ReactNode }) {
  return <div className="flex items-start justify-between gap-4"><div className="flex items-start gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--muted-bg)] text-[var(--primary)]"><Icon size={18} /></span><div><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-[var(--muted)]">{text}</p></div></div>{action}</div>;
}
