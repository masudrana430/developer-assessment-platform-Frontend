"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Clock3, CircleDollarSign, ListChecks, UserRound, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ApiResponse, Assessment, Attempt } from "@/types";

export default function AssessmentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["assessment", params.id],
    queryFn: () => apiRequest<ApiResponse<Assessment>>(`/assessments/${params.id}`),
  });

  const enroll = useMutation({
    mutationFn: () => apiRequest<ApiResponse<Attempt>>(`/attempts/enroll/${params.id}`, { method: "POST", auth: true }),
    onSuccess: async (result) => {
      if (result.data.status === "PENDING_PAYMENT") {
        const checkout = await apiRequest<ApiResponse<{ checkoutUrl: string | null }>>(`/payments/attempts/${result.data.id}/checkout`, { method: "POST", auth: true });
        if (checkout.data.checkoutUrl) window.location.href = checkout.data.checkoutUrl;
        return;
      }
      router.push(`/attempts/${result.data.id}`);
    },
  });

  const assessment = query.data?.data;

  if (query.isLoading) return <main className="mx-auto max-w-5xl px-4 py-12 text-[var(--muted)] sm:px-6">Loading assessment...</main>;
  if (query.error || !assessment) return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><p className="rounded-xl bg-red-500/10 p-4 text-red-600">{query.error instanceof Error ? query.error.message : "Assessment not found"}</p></main>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/assessments" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft size={16} /> Back to assessments</Link>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6 sm:p-8">
          <Badge tone="blue">{assessment.difficulty}</Badge>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{assessment.title}</h1>
          <p className="mt-5 whitespace-pre-wrap leading-7 text-[var(--muted)]">{assessment.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[var(--muted-bg)] p-4"><Clock3 size={18} className="text-[var(--primary)]" /><p className="mt-2 font-bold">{assessment.durationMinutes} minutes</p><p className="text-xs text-[var(--muted)]">Time limit</p></div>
            <div className="rounded-xl bg-[var(--muted-bg)] p-4"><ListChecks size={18} className="text-[var(--primary)]" /><p className="mt-2 font-bold">{assessment._count?.questions ?? 0} questions</p><p className="text-xs text-[var(--muted)]">Assessment items</p></div>
            <div className="rounded-xl bg-[var(--muted-bg)] p-4"><CircleDollarSign size={18} className="text-[var(--primary)]" /><p className="mt-2 font-bold">{assessment.feeCents ? `${(assessment.feeCents / 100).toFixed(2)} ${assessment.currency.toUpperCase()}` : "Free"}</p><p className="text-xs text-[var(--muted)]">Enrollment fee</p></div>
            <div className="rounded-xl bg-[var(--muted-bg)] p-4"><UserRound size={18} className="text-[var(--primary)]" /><p className="mt-2 font-bold">{assessment.creator?.name ?? "Platform reviewer"}</p><p className="text-xs text-[var(--muted)]">Created by</p></div>
          </div>
        </Card>

        <Card className="h-fit">
          <p className="text-sm text-[var(--muted)]">Passing score</p>
          <p className="mt-1 text-3xl font-bold">{assessment.passingScore}%</p>
          <div className="mt-5">
            {!user ? (
              <Link href="/login" className="inline-flex w-full justify-center rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white">Sign in to enroll</Link>
            ) : user.role !== "CANDIDATE" ? (
              <p className="rounded-xl bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">Only Candidate accounts can enroll.</p>
            ) : (
              <Button className="w-full" disabled={enroll.isPending} onClick={() => enroll.mutate()}>{enroll.isPending ? "Preparing..." : assessment.feeCents > 0 ? "Enroll & pay" : "Enroll for free"}</Button>
            )}
          </div>
          {enroll.error && <p className="mt-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-600">{enroll.error instanceof Error ? enroll.error.message : "Enrollment failed"}</p>}
          {user?.role === "CANDIDATE" && <Link href="/attempts" className="mt-3 block text-center text-sm font-semibold text-[var(--primary)]">View my attempts</Link>}
        </Card>
      </div>
    </main>
  );
}
