"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { apiRequest } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ApiResponse, Attempt, Question } from "@/types";

const gradeSchema = z.object({
  feedback: z.string().trim().min(3, "Overall feedback must be at least 3 characters").max(5000),
  grades: z.record(
    z.string(),
    z.object({
      score: z.string(),
      feedback: z.string().max(2000),
    }),
  ),
});

type GradeValues = z.infer<typeof gradeSchema>;

export default function ReviewAttemptPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const query = useQuery({
    queryKey: ["review-attempt", params.id],
    queryFn: () => apiRequest<ApiResponse<Attempt>>(`/reviews/${params.id}`, { auth: true }),
  });

  const attempt = query.data?.data;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GradeValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: { feedback: "", grades: {} },
  });

  useEffect(() => {
    if (!attempt) return;
    const grades: GradeValues["grades"] = {};
    for (const question of attempt.assessment.questions ?? []) {
      if (question.type === "MCQ") continue;
      const answer = question.answers?.[0];
      if (answer) {
        grades[answer.id] = {
          score: answer.reviewerScore?.toString() ?? "",
          feedback: answer.feedback ?? "",
        };
      }
    }
    reset({ feedback: attempt.review?.feedback ?? "", grades });
  }, [attempt, reset]);

  if (query.isLoading) {
    return <main className="mx-auto max-w-5xl px-4 py-12 text-[var(--muted)] sm:px-6">Loading submission...</main>;
  }

  if (query.error || !attempt) {
    return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><p className="rounded-xl bg-red-500/10 p-4 text-red-600">{query.error instanceof Error ? query.error.message : "Review not found"}</p></main>;
  }

  const evaluated = attempt.status === "EVALUATED";

  async function submit(values: GradeValues) {
    const questions = attempt.assessment.questions ?? [];
    const pointsByAnswer = new Map<string, number>();
    for (const question of questions) {
      const answer = question.answers?.[0];
      if (answer) pointsByAnswer.set(answer.id, question.points);
    }

    const answers = Object.entries(values.grades)
      .filter(([, grade]) => grade.score !== "")
      .map(([answerId, grade]) => {
        const score = Number(grade.score);
        const maximum = pointsByAnswer.get(answerId) ?? 0;
        if (!Number.isFinite(score) || score < 0 || score > maximum) {
          throw new Error(`Score must be between 0 and ${maximum}`);
        }
        return {
          answerId,
          score,
          ...(grade.feedback.trim() ? { feedback: grade.feedback.trim() } : {}),
        };
      });

    try {
      await apiRequest<ApiResponse<unknown>>(`/reviews/${params.id}/evaluate`, {
        method: "POST",
        auth: true,
        body: JSON.stringify({ feedback: values.feedback.trim(), answers }),
      });
      toast.success("Evaluation finalized");
      router.push("/reviewer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to finalize evaluation");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/reviewer" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
        <ArrowLeft size={16} /> Reviewer workspace
      </Link>

      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-[var(--primary)]">Candidate: {attempt.candidate?.name}</p>
          <h1 className="mt-1 text-3xl font-bold">{attempt.assessment.title}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{attempt.candidate?.email}</p>
        </div>
        <Badge tone={evaluated ? "green" : "amber"}>{attempt.status.replaceAll("_", " ")}</Badge>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(submit)} noValidate>
        {(attempt.assessment.questions ?? []).map((question, index) => (
          <GradeQuestion key={question.id} question={question} index={index} register={register} readOnly={evaluated} />
        ))}

        <Card>
          <label className="block text-sm font-semibold">
            Overall feedback
            <Textarea className="mt-2 min-h-28" disabled={evaluated} {...register("feedback")} />
            {errors.feedback ? <span className="mt-1 block text-xs text-red-600">{errors.feedback.message}</span> : null}
          </label>
          {!evaluated ? (
            <div className="mt-4 flex justify-end">
              <Button disabled={isSubmitting}>
                {isSubmitting ? <LoaderCircle className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                {isSubmitting ? "Finalizing..." : "Finalize evaluation"}
              </Button>
            </div>
          ) : null}
        </Card>
      </form>
    </main>
  );
}

function GradeQuestion({
  question,
  index,
  register,
  readOnly,
}: {
  question: Question;
  index: number;
  register: ReturnType<typeof useForm<GradeValues>>["register"];
  readOnly: boolean;
}) {
  const answer = question.answers?.[0];

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[var(--primary)]">Question {index + 1} · {question.type}</p>
          <h2 className="mt-2 font-bold">{question.prompt}</h2>
        </div>
        <span className="text-sm font-semibold text-[var(--muted)]">{question.points} pts</span>
      </div>

      {question.type === "MCQ" ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl bg-[var(--muted-bg)] p-3 text-sm"><span className="font-semibold">Candidate:</span> {String(answer?.response ?? "No answer")}</div>
          <div className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400"><span className="font-semibold">Correct:</span> {String(question.correctAnswer ?? "—")}</div>
        </div>
      ) : (
        <>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[var(--muted-bg)] p-4 text-sm">{String(answer?.response ?? "No answer")}</pre>
          {answer ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-[140px_1fr]">
              <label className="text-sm font-semibold">
                Score
                <Input
                  className="mt-1.5"
                  type="number"
                  min={0}
                  max={question.points}
                  disabled={readOnly}
                  {...register(`grades.${answer.id}.score`)}
                />
              </label>
              <label className="text-sm font-semibold">
                Answer feedback
                <Input
                  className="mt-1.5"
                  disabled={readOnly}
                  {...register(`grades.${answer.id}.feedback`)}
                />
              </label>
            </div>
          ) : null}
        </>
      )}
    </Card>
  );
}
