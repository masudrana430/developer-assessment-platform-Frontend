"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Send, Trash2 } from "lucide-react";
import { RequireAuth } from "@/components/guard";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ApiResponse, Assessment, Question, QuestionType } from "@/types";

export default function ManageAssessmentPage() {
  return <RequireAuth roles={["REVIEWER"]}><ManageAssessment /></RequireAuth>;
}

function ManageAssessment() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["managed-assessment", params.id],
    queryFn: () => apiRequest<ApiResponse<Assessment>>(`/assessments/manage/${params.id}`, { auth: true }),
  });

  const publish = useMutation({
    mutationFn: () => apiRequest<ApiResponse<Assessment>>(`/assessments/${params.id}/publish`, { method: "PATCH", auth: true }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["managed-assessment", params.id] }),
  });

  const removeQuestion = useMutation({
    mutationFn: (questionId: string) => apiRequest<ApiResponse<null>>(`/assessments/${params.id}/questions/${questionId}`, { method: "DELETE", auth: true }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["managed-assessment", params.id] }),
  });

  const assessment = query.data?.data;
  if (query.isLoading) return <main className="mx-auto max-w-5xl px-4 py-12 text-[var(--muted)] sm:px-6">Loading assessment...</main>;
  if (query.error || !assessment) return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><p className="text-red-600">{query.error instanceof Error ? query.error.message : "Not found"}</p></main>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/reviewer" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)]"><ArrowLeft size={16} /> Reviewer workspace</Link>
      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div><div className="flex flex-wrap items-center gap-2"><h1 className="text-3xl font-bold">{assessment.title}</h1><Badge>{assessment.status}</Badge></div><p className="mt-2 max-w-2xl text-[var(--muted)]">{assessment.description}</p></div>
        {assessment.status !== "PUBLISHED" && <Button disabled={publish.isPending || !assessment.questions?.length} onClick={() => publish.mutate()}><Send size={16} /> {publish.isPending ? "Publishing..." : "Publish"}</Button>}
      </div>
      {publish.error && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600">{publish.error.message}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="text-xl font-bold">Questions</h2>
          <div className="mt-4 grid gap-3">
            {assessment.questions?.map((question) => (
              <Card key={question.id}>
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-xs font-bold text-[var(--primary)]">{question.type} · {question.points} points</p><h3 className="mt-2 font-bold">{question.order}. {question.prompt}</h3>{Array.isArray(question.options) && <p className="mt-2 text-sm text-[var(--muted)]">{(question.options as string[]).join(" · ")}</p>}</div>
                  {assessment.status !== "PUBLISHED" && <button onClick={() => window.confirm("Delete this question?") && removeQuestion.mutate(question.id)} className="text-red-600"><Trash2 size={17} /></button>}
                </div>
              </Card>
            ))}
            {!assessment.questions?.length && <Card><p className="text-sm text-[var(--muted)]">Add at least one question before publishing.</p></Card>}
          </div>
        </section>
        <AddQuestion assessmentId={assessment.id} nextOrder={(assessment.questions?.length ?? 0) + 1} disabled={assessment.status === "PUBLISHED"} onCreated={() => void queryClient.invalidateQueries({ queryKey: ["managed-assessment", params.id] })} />
      </div>
    </main>
  );
}

function AddQuestion({ assessmentId, nextOrder, disabled, onCreated }: { assessmentId: string; nextOrder: number; disabled: boolean; onCreated: () => void }) {
  const [type, setType] = useState<QuestionType>("MCQ");
  const [prompt, setPrompt] = useState("");
  const [points, setPoints] = useState(10);
  const [order, setOrder] = useState(nextOrder);
  const [options, setOptions] = useState("Option A\nOption B");
  const [correctAnswer, setCorrectAnswer] = useState("Option A");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const parsed = options.split("\n").map((item) => item.trim()).filter(Boolean);
      const body = {
        prompt,
        type,
        points,
        order,
        ...(type === "MCQ" ? { options: parsed, correctAnswer } : {}),
      };
      await apiRequest<ApiResponse<Question>>(`/assessments/${assessmentId}/questions`, { method: "POST", auth: true, body: JSON.stringify(body) });
      setPrompt("");
      setOrder((value) => value + 1);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add question");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="h-fit">
      <div className="flex items-center gap-2"><Plus size={18} className="text-[var(--primary)]" /><h2 className="font-bold">Add question</h2></div>
      {disabled ? <p className="mt-4 text-sm text-[var(--muted)]">Published assessment content is locked.</p> : (
        <form className="mt-5 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold">Type<Select className="mt-1.5" value={type} onChange={(e) => setType(e.target.value as QuestionType)}><option value="MCQ">MCQ</option><option value="TEXT">Text</option><option value="CODE">Code</option></Select></label>
          <label className="block text-sm font-semibold">Prompt<Textarea className="mt-1.5 min-h-24" value={prompt} onChange={(e) => setPrompt(e.target.value)} required /></label>
          {type === "MCQ" && <>
            <label className="block text-sm font-semibold">Options, one per line<Textarea className="mt-1.5 min-h-24" value={options} onChange={(e) => setOptions(e.target.value)} /></label>
            <label className="block text-sm font-semibold">Correct answer<Input className="mt-1.5" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} /></label>
          </>}
          <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Points<Input className="mt-1.5" type="number" min={1} max={100} value={points} onChange={(e) => setPoints(Number(e.target.value))} /></label><label className="text-sm font-semibold">Order<Input className="mt-1.5" type="number" min={1} value={order} onChange={(e) => setOrder(Number(e.target.value))} /></label></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? "Adding..." : "Add question"}</Button>
        </form>
      )}
    </Card>
  );
}
