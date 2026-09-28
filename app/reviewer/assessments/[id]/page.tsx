"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { QuestionForm } from "@/components/reviewer/question-form";
import type { ApiResponse, Assessment } from "@/types";

export default function ManageAssessmentPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const queryKey = ["managed-assessment", params.id];

  const query = useQuery({
    queryKey,
    queryFn: () => apiRequest<ApiResponse<Assessment>>(`/assessments/manage/${params.id}`, { auth: true }),
  });

  const publish = useMutation({
    mutationFn: () => apiRequest<ApiResponse<Assessment>>(`/assessments/${params.id}/publish`, { method: "PATCH", auth: true }),
    onSuccess: () => {
      toast.success("Assessment published");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to publish"),
  });

  const removeQuestion = useMutation({
    mutationFn: (questionId: string) =>
      apiRequest<ApiResponse<null>>(`/assessments/${params.id}/questions/${questionId}`, {
        method: "DELETE",
        auth: true,
      }),
    onSuccess: () => {
      toast.success("Question removed");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to delete question"),
  });

  const assessment = query.data?.data;

  if (query.isLoading) {
    return <main className="mx-auto max-w-5xl px-4 py-12 text-[var(--muted)] sm:px-6">Loading assessment...</main>;
  }

  if (query.error || !assessment) {
    return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><p className="rounded-xl bg-red-500/10 p-4 text-sm text-red-600">{query.error instanceof Error ? query.error.message : "Assessment not found"}</p></main>;
  }

  const contentLocked = assessment.status === "PUBLISHED" || (assessment._count?.attempts ?? 0) > 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/reviewer/assessments" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
        <ArrowLeft size={16} /> My assessments
      </Link>

      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold">{assessment.title}</h1>
            <Badge>{assessment.status}</Badge>
          </div>
          <p className="mt-2 max-w-2xl text-[var(--muted)]">{assessment.description}</p>
          <p className="mt-2 text-xs text-[var(--muted)]">{assessment._count?.attempts ?? 0} candidate attempts</p>
        </div>

        {assessment.status !== "PUBLISHED" ? (
          <Button disabled={publish.isPending || !assessment.questions?.length} onClick={() => publish.mutate()}>
            <Send size={16} /> {publish.isPending ? "Publishing..." : "Publish"}
          </Button>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="text-xl font-bold">Questions</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Question data is loaded from the protected reviewer endpoint.</p>

          <div className="mt-4 grid gap-3">
            {assessment.questions?.map((question) => (
              <Card key={question.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-[var(--primary)]">{question.type} · {question.points} points</p>
                    <h3 className="mt-2 font-bold">{question.order}. {question.prompt}</h3>
                    {Array.isArray(question.options) ? (
                      <p className="mt-2 text-sm text-[var(--muted)]">{(question.options as string[]).join(" · ")}</p>
                    ) : null}
                  </div>

                  {!contentLocked ? (
                    <ConfirmDialog
                      trigger={<button className="rounded-lg p-2 text-red-600 hover:bg-red-500/10" aria-label="Delete question"><Trash2 size={17} /></button>}
                      title="Delete this question?"
                      description="The question will be soft-deleted by the backend and removed from this assessment."
                      confirmLabel="Delete question"
                      destructive
                      onConfirm={() => removeQuestion.mutate(question.id)}
                    />
                  ) : null}
                </div>
              </Card>
            ))}

            {!assessment.questions?.length ? (
              <EmptyState title="No questions yet" description="Add the first scoreable question to make this assessment publishable." icon={Send} />
            ) : null}
          </div>
        </section>

        <QuestionForm
          assessmentId={assessment.id}
          nextOrder={(assessment.questions?.length ?? 0) + 1}
          disabled={contentLocked}
          onCreated={() => void queryClient.invalidateQueries({ queryKey })}
        />
      </div>
    </main>
  );
}
