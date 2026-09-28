"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ApiResponse, Assessment } from "@/types";

const schema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  slug: z.string().trim().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case"),
  description: z.string().trim().min(20, "Description must be at least 20 characters").max(5000),
  difficulty: z.enum(["JUNIOR", "MID", "SENIOR"]),
  durationMinutes: z.number().int().min(5).max(480),
  passingScore: z.number().min(0).max(100),
  feeCents: z.number().int().min(0).max(10000000),
  currency: z.string().trim().length(3, "Use a 3-letter currency code").transform((value) => value.toLowerCase()),
});

type Values = z.infer<typeof schema>;

const steps = ["Basics", "Scoring", "Payment & review"] as const;

export function AssessmentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      difficulty: "MID",
      durationMinutes: 60,
      passingScore: 70,
      feeCents: 1000,
      currency: "usd",
    },
    mode: "onBlur",
  });

  const values = watch();

  async function next() {
    const fields: Array<keyof Values> =
      step === 0
        ? ["title", "slug", "description", "difficulty"]
        : ["durationMinutes", "passingScore"];

    if (await trigger(fields)) setStep((current) => Math.min(2, current + 1));
  }

  async function submit(values: Values) {
    try {
      const response = await apiRequest<ApiResponse<Assessment>>("/assessments", {
        method: "POST",
        auth: true,
        body: JSON.stringify(values),
      });
      toast.success("Assessment created. Add questions before publishing.");
      router.push(`/reviewer/assessments/${response.data.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create assessment");
    }
  }

  function autoSlug(title: string) {
    setValue("title", title, { shouldValidate: true });
    const currentSlug = watch("slug");
    if (!currentSlug) {
      setValue(
        "slug",
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        { shouldValidate: true },
      );
    }
  }

  return (
    <Card className="mt-8 p-6 sm:p-8">
      <div className="grid grid-cols-3 gap-2">
        {steps.map((label, index) => (
          <div key={label}>
            <div className={`h-1.5 rounded-full ${index <= step ? "bg-[var(--primary)]" : "bg-[var(--muted-bg)]"}`} />
            <p className={`mt-2 text-xs font-semibold ${index === step ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
              {index + 1}. {label}
            </p>
          </div>
        ))}
      </div>

      <form className="mt-8" onSubmit={handleSubmit(submit)} noValidate>
        {step === 0 ? (
          <div className="grid gap-5">
            <Field label="Title" error={errors.title?.message}>
              <Input value={values.title} onChange={(event) => autoSlug(event.target.value)} />
            </Field>
            <Field label="Slug" error={errors.slug?.message}>
              <Input {...register("slug")} />
            </Field>
            <Field label="Description" error={errors.description?.message}>
              <Textarea className="min-h-32" {...register("description")} />
            </Field>
            <Field label="Difficulty" error={errors.difficulty?.message}>
              <Select {...register("difficulty")}>
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid</option>
                <option value="SENIOR">Senior</option>
              </Select>
            </Field>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Duration (minutes)" error={errors.durationMinutes?.message}>
              <Input type="number" min={5} max={480} {...register("durationMinutes", { valueAsNumber: true })} />
            </Field>
            <Field label="Passing score (%)" error={errors.passingScore?.message}>
              <Input type="number" min={0} max={100} step="0.1" {...register("passingScore", { valueAsNumber: true })} />
            </Field>
            <div className="sm:col-span-2 rounded-xl bg-[var(--muted-bg)] p-4 text-sm leading-6 text-[var(--muted)]">
              Questions and total points are added after this wizard. The backend prevents publishing an assessment without scoreable questions.
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Fee in cents" error={errors.feeCents?.message}>
                <Input type="number" min={0} {...register("feeCents", { valueAsNumber: true })} />
              </Field>
              <Field label="Currency" error={errors.currency?.message}>
                <Input maxLength={3} {...register("currency")} />
              </Field>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted-bg)] p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--primary)]">Review</p>
              <h2 className="mt-2 text-xl font-bold">{values.title || "Untitled assessment"}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{values.description || "Add a description in step one."}</p>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <p><span className="font-semibold">Difficulty:</span> {values.difficulty}</p>
                <p><span className="font-semibold">Duration:</span> {values.durationMinutes} min</p>
                <p><span className="font-semibold">Passing score:</span> {values.passingScore}%</p>
                <p><span className="font-semibold">Fee:</span> {values.feeCents ? `${(Number(values.feeCents) / 100).toFixed(2)} ${values.currency.toUpperCase()}` : "Free"}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button type="button" variant="secondary" disabled={step === 0 || isSubmitting} onClick={() => setStep((current) => Math.max(0, current - 1))}>
            <ArrowLeft size={16} /> Back
          </Button>
          {step < 2 ? (
            <Button type="button" onClick={() => void next()}>
              Continue <ArrowRight size={16} />
            </Button>
          ) : (
            <Button disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="animate-spin" size={16} /> : <Check size={16} />}
              {isSubmitting ? "Creating..." : "Create assessment"}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <div className="mt-1.5">{children}</div>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
