"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/guard";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { ApiResponse, Assessment, Difficulty } from "@/types";

export default function NewAssessmentPage() {
  return <RequireAuth roles={["REVIEWER"]}><NewAssessment /></RequireAuth>;
}

function NewAssessment() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    difficulty: "MID" as Difficulty,
    durationMinutes: 60,
    passingScore: 70,
    feeCents: 1000,
    currency: "usd",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest<ApiResponse<Assessment>>("/assessments", {
        method: "POST",
        auth: true,
        body: JSON.stringify(form),
      });
      router.push(`/reviewer/assessments/${response.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create assessment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Reviewer</p>
      <h1 className="mt-1 text-3xl font-bold">Create assessment</h1>
      <p className="mt-2 text-[var(--muted)]">Start with the assessment settings, then add questions before publishing.</p>

      <Card className="mt-8 p-6">
        <form className="grid gap-5" onSubmit={submit}>
          <label className="text-sm font-semibold">Title<Input className="mt-1.5" value={form.title} onChange={(e) => { update("title", e.target.value); if (!form.slug) update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} minLength={3} required /></label>
          <label className="text-sm font-semibold">Slug<Input className="mt-1.5" value={form.slug} onChange={(e) => update("slug", e.target.value)} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /></label>
          <label className="text-sm font-semibold">Description<Textarea className="mt-1.5 min-h-32" value={form.description} onChange={(e) => update("description", e.target.value)} minLength={20} required /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Difficulty<Select className="mt-1.5" value={form.difficulty} onChange={(e) => update("difficulty", e.target.value as Difficulty)}><option value="JUNIOR">Junior</option><option value="MID">Mid</option><option value="SENIOR">Senior</option></Select></label>
            <label className="text-sm font-semibold">Duration (minutes)<Input className="mt-1.5" type="number" min={5} max={480} value={form.durationMinutes} onChange={(e) => update("durationMinutes", Number(e.target.value))} /></label>
            <label className="text-sm font-semibold">Passing score (%)<Input className="mt-1.5" type="number" min={0} max={100} value={form.passingScore} onChange={(e) => update("passingScore", Number(e.target.value))} /></label>
            <label className="text-sm font-semibold">Fee in cents<Input className="mt-1.5" type="number" min={0} value={form.feeCents} onChange={(e) => update("feeCents", Number(e.target.value))} /></label>
          </div>
          {error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-600">{error}</p>}
          <div className="flex justify-end"><Button disabled={loading}>{loading ? "Creating..." : "Create assessment"}</Button></div>
        </form>
      </Card>
    </main>
  );
}
