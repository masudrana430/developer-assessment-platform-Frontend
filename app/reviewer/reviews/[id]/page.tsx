"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { RequireAuth } from "@/components/guard";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ApiResponse, Attempt, Question } from "@/types";

type GradeState = Record<string, { score: string; feedback: string }>;

export default function ReviewAttemptPage() {
  return <RequireAuth roles={["REVIEWER"]}><ReviewAttempt /></RequireAuth>;
}

function ReviewAttempt() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [grades, setGrades] = useState<GradeState>({});

  const query = useQuery({
    queryKey: ["review-attempt", params.id],
    queryFn: () => apiRequest<ApiResponse<Attempt>>(`/reviews/${params.id}`, { auth: true }),
  });

  const attempt = query.data?.data;

  useEffect(() => {
    if (!attempt) return;
    const initial: GradeState = {};
    for (const question of attempt.assessment.questions ?? []) {
      if (question.type === "MCQ") continue;
      const answer = question.answers?.[0];
      if (answer) initial[answer.id] = { score: answer.reviewerScore?.toString() ?? "", feedback: answer.feedback ?? "" };
    }
    setGrades(initial);
    setFeedback(attempt.review?.feedback ?? "");
  }, [attempt]);

  const evaluate = useMutation({
    mutationFn: () => {
      const answers = Object.entries(grades)
        .filter(([, grade]) => grade.score !== "")
        .map(([answerId, grade]) => ({ answerId, score: Number(grade.score), ...(grade.feedback.trim() ? { feedback: grade.feedback.trim() } : {}) }));
      return apiRequest<ApiResponse<unknown>>(`/reviews/${params.id}/evaluate`, {
        method: "POST",
        auth: true,
        body: JSON.stringify({ feedback, answers }),
      });
    },
    onSuccess: () => router.push("/reviewer"),
  });

  if (query.isLoading) return <main className="mx-auto max-w-5xl px-4 py-12 text-[var(--muted)] sm:px-6">Loading submission...</main>;
  if (query.error || !attempt) return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><p className="text-red-600">{query.error instanceof Error ? query.error.message : "Review not found"}</p></main>;

  const evaluated = attempt.status === "EVALUATED";

  function submit(event: FormEvent) {
    event.preventDefault();
    if (window.confirm("Finalize this evaluation?")) evaluate.mutate();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/reviewer" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)]"><ArrowLeft size={16} /> Reviewer workspace</Link>
      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div><p className="text-sm font-semibold text-[var(--primary)]">Candidate: {attempt.candidate?.name}</p><h1 className="mt-1 text-3xl font-bold">{attempt.assessment.title}</h1><p className="mt-2 text-sm text-[var(--muted)]">{attempt.candidate?.email}</p></div>
        <Badge tone={evaluated ? "green" : "amber"}>{attempt.status.replaceAll("_", " ")}</Badge>
      </div>

      <form className="mt-8 space-y-5" onSubmit={submit}>
        {(attempt.assessment.questions ?? []).map((question, index) => <GradeQuestion key={question.id} question={question} index={index} grades={grades} setGrades={setGrades} readOnly={evaluated} />)}
        <Card>
          <label className="block text-sm font-semibold">Overall feedback<Textarea className="mt-2 min-h-28" value={feedback} disabled={evaluated} onChange={(e) => setFeedback(e.target.value)} required minLength={3} /></label>
          {!evaluated && <div className="mt-4 flex justify-end"><Button disabled={evaluate.isPending}><CheckCircle2 size={16} /> {evaluate.isPending ? "Finalizing..." : "Finalize evaluation"}</Button></div>}
          {evaluate.error && <p className="mt-3 text-sm text-red-600">{evaluate.error.message}</p>}
        </Card>
      </form>
    </main>
  );
}

function GradeQuestion({ question, index, grades, setGrades, readOnly }: { question: Question; index: number; grades: GradeState; setGrades: React.Dispatch<React.SetStateAction<GradeState>>; readOnly: boolean }) {
  const answer = question.answers?.[0];
  const grade = answer ? grades[answer.id] : undefined;
  return (
    <Card>
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold text-[var(--primary)]">Question {index + 1} · {question.type}</p><h2 className="mt-2 font-bold">{question.prompt}</h2></div><span className="text-sm font-semibold text-[var(--muted)]">{question.points} pts</span></div>
      {question.type === "MCQ" && <div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="rounded-xl bg-[var(--muted-bg)] p-3 text-sm"><span className="font-semibold">Candidate:</span> {String(answer?.response ?? "No answer")}</div><div className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400"><span className="font-semibold">Correct:</span> {String(question.correctAnswer ?? "—")}</div></div>}
      {question.type !== "MCQ" && <><pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[var(--muted-bg)] p-4 text-sm">{String(answer?.response ?? "No answer")}</pre>{answer && <div className="mt-4 grid gap-3 sm:grid-cols-[140px_1fr]"><label className="text-sm font-semibold">Score<Input className="mt-1.5" type="number" min={0} max={question.points} disabled={readOnly} value={grade?.score ?? ""} onChange={(e) => setGrades((current) => ({ ...current, [answer.id]: { score: e.target.value, feedback: current[answer.id]?.feedback ?? "" } }))} /></label><label className="text-sm font-semibold">Answer feedback<Input className="mt-1.5" disabled={readOnly} value={grade?.feedback ?? ""} onChange={(e) => setGrades((current) => ({ ...current, [answer.id]: { score: current[answer.id]?.score ?? "", feedback: e.target.value } }))} /></label></div>}</>}
    </Card>
  );
}
