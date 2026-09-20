"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Clock3, CreditCard, Play, Send, Trophy, MessageSquareText } from "lucide-react";
import { RequireAuth } from "@/components/guard";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status-badge";
import type { ApiResponse, Attempt, Question } from "@/types";

export default function AttemptPage() {
  return <RequireAuth roles={["CANDIDATE"]}><AttemptContent /></RequireAuth>;
}

function AttemptContent() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState("");
  const query = useQuery({
    queryKey: ["attempt", params.id],
    queryFn: () => apiRequest<ApiResponse<Attempt>>(`/attempts/${params.id}`, { auth: true }),
    refetchInterval: 15_000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["attempt", params.id] });

  const checkout = useMutation({
    mutationFn: () => apiRequest<ApiResponse<{ checkoutUrl: string | null }>>(`/payments/attempts/${params.id}/checkout`, { method: "POST", auth: true }),
    onSuccess: (result) => {
      if (result.data.checkoutUrl) window.location.href = result.data.checkoutUrl;
    },
  });

  const start = useMutation({
    mutationFn: () => apiRequest<ApiResponse<Attempt>>(`/attempts/${params.id}/start`, { method: "POST", auth: true }),
    onSuccess: () => { setNotice("Attempt started. The timer is now running."); void invalidate(); },
  });

  const submit = useMutation({
    mutationFn: () => apiRequest<ApiResponse<Attempt>>(`/attempts/${params.id}/submit`, { method: "POST", auth: true }),
    onSuccess: () => { setNotice("Attempt submitted successfully."); void invalidate(); },
  });

  const attempt = query.data?.data;
  const questions = attempt?.assessment.questions ?? [];

  if (query.isLoading) return <main className="mx-auto max-w-6xl px-4 py-12 text-[var(--muted)] sm:px-6">Loading attempt...</main>;
  if (query.error || !attempt) return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><p className="rounded-xl bg-red-500/10 p-4 text-red-600">{query.error instanceof Error ? query.error.message : "Attempt not found"}</p></main>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link href="/attempts" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)]"><ArrowLeft size={16} /> My attempts</Link>

      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold sm:text-3xl">{attempt.assessment.title}</h1><StatusBadge status={attempt.status} /></div>
          <p className="mt-2 text-sm text-[var(--muted)]">Attempt #{attempt.attemptNo}</p>
        </div>
        {attempt.expiresAt && attempt.status === "IN_PROGRESS" && <Countdown expiresAt={attempt.expiresAt} />}
      </div>

      {notice && <p className="mt-5 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">{notice}</p>}

      <div className="mt-8">
        {attempt.status === "PENDING_PAYMENT" && <PaymentStep attempt={attempt} loading={checkout.isPending} error={checkout.error} onPay={() => checkout.mutate()} />}
        {attempt.status === "READY" && <ReadyStep attempt={attempt} loading={start.isPending} error={start.error} onStart={() => start.mutate()} />}
        {attempt.status === "IN_PROGRESS" && <ExecutionStep attemptId={attempt.id} questions={questions} loading={submit.isPending} error={submit.error} onSubmit={() => { if (window.confirm("Submit this attempt? You will not be able to change answers afterwards.")) submit.mutate(); }} />}
        {(attempt.status === "SUBMITTED" || attempt.status === "UNDER_REVIEW") && <WaitingStep status={attempt.status} />}
        {attempt.status === "EVALUATED" && <ResultStep attempt={attempt} />}
        {attempt.status === "CANCELLED" && <Card><h2 className="font-bold">Attempt cancelled</h2><p className="mt-2 text-sm text-[var(--muted)]">This attempt can no longer be continued.</p></Card>}
      </div>
    </main>
  );
}

function PaymentStep({ attempt, loading, error, onPay }: { attempt: Attempt; loading: boolean; error: Error | null; onPay: () => void }) {
  return <Card className="max-w-xl"><CreditCard className="text-[var(--primary)]" /><h2 className="mt-4 text-xl font-bold">Payment required</h2><p className="mt-2 text-sm text-[var(--muted)]">Complete Stripe Checkout to unlock this assessment.</p><p className="mt-5 text-2xl font-bold">{((attempt.assessment.feeCents ?? 0) / 100).toFixed(2)} {(attempt.assessment.currency ?? "usd").toUpperCase()}</p><Button className="mt-5" disabled={loading} onClick={onPay}>{loading ? "Creating checkout..." : "Pay with Stripe"}</Button>{error && <p className="mt-3 text-sm text-red-600">{error.message}</p>}</Card>;
}

function ReadyStep({ attempt, loading, error, onStart }: { attempt: Attempt; loading: boolean; error: Error | null; onStart: () => void }) {
  return <Card className="max-w-xl"><Play className="text-[var(--primary)]" /><h2 className="mt-4 text-xl font-bold">Ready to begin</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">You will have {attempt.assessment.durationMinutes} minutes once you start. Questions become visible only after the timer begins.</p><Button className="mt-5" disabled={loading} onClick={onStart}>{loading ? "Starting..." : "Start assessment"}</Button>{error && <p className="mt-3 text-sm text-red-600">{error.message}</p>}</Card>;
}

function ExecutionStep({ attemptId, questions, loading, error, onSubmit }: { attemptId: string; questions: Question[]; loading: boolean; error: Error | null; onSubmit: () => void }) {
  return <div className="space-y-5">{questions.map((question, index) => <QuestionCard key={question.id} attemptId={attemptId} question={question} index={index} />)}<Card className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="font-bold">Ready to submit?</h2><p className="mt-1 text-sm text-[var(--muted)]">Review your answers first. Submission is final.</p></div><Button disabled={loading} onClick={onSubmit}><Send size={16} /> {loading ? "Submitting..." : "Submit attempt"}</Button>{error && <p className="text-sm text-red-600">{error.message}</p>}</Card></div>;
}

function QuestionCard({ attemptId, question, index }: { attemptId: string; question: Question; index: number }) {
  const saved = question.answers?.[0]?.response;
  const initial = typeof saved === "string" ? saved : "";
  const [response, setResponse] = useState(initial);
  const mutation = useMutation({
    mutationFn: () => apiRequest<ApiResponse<unknown>>(`/attempts/${attemptId}/answers/${question.id}`, { method: "PUT", auth: true, body: JSON.stringify({ response }) }),
  });

  return <Card><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wide text-[var(--primary)]">Question {index + 1} · {question.type}</p><h2 className="mt-2 text-lg font-bold">{question.prompt}</h2></div><span className="shrink-0 text-sm font-semibold text-[var(--muted)]">{question.points} pts</span></div>{question.type === "MCQ" && Array.isArray(question.options) ? <div className="mt-5 grid gap-2">{(question.options as string[]).map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] p-3 hover:bg-[var(--muted-bg)]"><input type="radio" name={question.id} value={option} checked={response === option} onChange={(e) => setResponse(e.target.value)} /> <span className="text-sm">{option}</span></label>)}</div> : <Textarea className="mt-5 min-h-36 font-mono" placeholder={question.type === "CODE" ? "Write your code or solution..." : "Write your answer..."} value={response} onChange={(e) => setResponse(e.target.value)} />}<div className="mt-4 flex items-center gap-3"><Button variant="secondary" disabled={!response || mutation.isPending} onClick={() => mutation.mutate()}>{mutation.isPending ? "Saving..." : "Save answer"}</Button>{mutation.isSuccess && <span className="text-xs font-semibold text-emerald-600">Saved</span>}{mutation.error && <span className="text-xs text-red-600">{mutation.error.message}</span>}</div></Card>;
}

function WaitingStep({ status }: { status: Attempt["status"] }) {
  return <Card className="max-w-xl"><MessageSquareText className="text-[var(--primary)]" /><h2 className="mt-4 text-xl font-bold">{status === "UNDER_REVIEW" ? "Review in progress" : "Submission received"}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{status === "UNDER_REVIEW" ? "A reviewer has claimed your submission and is evaluating subjective answers." : "Your answers are locked. A reviewer will claim the submission next."}</p></Card>;
}

function ResultStep({ attempt }: { attempt: Attempt }) {
  return <Card className="max-w-2xl"><Trophy className={attempt.passed ? "text-emerald-500" : "text-amber-500"} /><h2 className="mt-4 text-2xl font-bold">{attempt.passed ? "Assessment passed" : "Assessment evaluated"}</h2><p className="mt-2 text-4xl font-bold">{attempt.finalScore ?? 0}%</p><p className="mt-1 text-sm text-[var(--muted)]">Passing score: {attempt.assessment.passingScore}%</p>{attempt.review && <div className="mt-6 rounded-xl bg-[var(--muted-bg)] p-4"><p className="text-xs font-bold uppercase text-[var(--muted)]">Reviewer feedback</p><p className="mt-2 leading-6">{attempt.review.feedback}</p></div>}</Card>;
}

function Countdown({ expiresAt }: { expiresAt: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const remaining = useMemo(() => Math.max(0, new Date(expiresAt).getTime() - now), [expiresAt, now]);
  const minutes = Math.floor(remaining / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  return <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 font-mono text-sm font-bold"><Clock3 size={17} className="text-[var(--primary)]" /> {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</div>;
}
