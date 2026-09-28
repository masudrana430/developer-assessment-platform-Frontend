"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ApiResponse, Question } from "@/types";

const schema = z
  .object({
    type: z.enum(["MCQ", "TEXT", "CODE"]),
    prompt: z.string().trim().min(3, "Prompt is required").max(10000),
    points: z.coerce.number().int().min(1).max(100),
    order: z.coerce.number().int().min(1).max(1000),
    optionsText: z.string(),
    correctAnswer: z.string(),
  })
  .superRefine((value, context) => {
    if (value.type !== "MCQ") return;
    const options = value.optionsText.split("\n").map((item) => item.trim()).filter(Boolean);
    if (options.length < 2) context.addIssue({ code: "custom", path: ["optionsText"], message: "MCQ requires at least 2 options" });
    if (!value.correctAnswer.trim()) context.addIssue({ code: "custom", path: ["correctAnswer"], message: "Correct answer is required" });
    if (value.correctAnswer.trim() && !options.includes(value.correctAnswer.trim())) {
      context.addIssue({ code: "custom", path: ["correctAnswer"], message: "Correct answer must exactly match an option" });
    }
  });

type Values = z.infer<typeof schema>;

export function QuestionForm({
  assessmentId,
  nextOrder,
  disabled,
  onCreated,
}: {
  assessmentId: string;
  nextOrder: number;
  disabled: boolean;
  onCreated: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "MCQ",
      prompt: "",
      points: 10,
      order: nextOrder,
      optionsText: "Option A\nOption B",
      correctAnswer: "Option A",
    },
  });

  useEffect(() => setValue("order", nextOrder), [nextOrder, setValue]);
  const type = watch("type");

  async function submit(values: Values) {
    const options = values.optionsText.split("\n").map((item) => item.trim()).filter(Boolean);
    const payload = {
      prompt: values.prompt,
      type: values.type,
      points: values.points,
      order: values.order,
      ...(values.type === "MCQ" ? { options, correctAnswer: values.correctAnswer.trim() } : {}),
    };

    try {
      await apiRequest<ApiResponse<Question>>(`/assessments/${assessmentId}/questions`, {
        method: "POST",
        auth: true,
        body: JSON.stringify(payload),
      });
      toast.success("Question added");
      reset({
        type: values.type,
        prompt: "",
        points: 10,
        order: values.order + 1,
        optionsText: "Option A\nOption B",
        correctAnswer: "Option A",
      });
      onCreated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add question");
    }
  }

  return (
    <Card className="h-fit">
      <div className="flex items-center gap-2"><Plus size={18} className="text-[var(--primary)]" /><h2 className="font-bold">Add question</h2></div>
      {disabled ? (
        <p className="mt-4 text-sm text-[var(--muted)]">Published assessment content is locked.</p>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={handleSubmit(submit)} noValidate>
          <Field label="Type" error={errors.type?.message}>
            <Select {...register("type")}><option value="MCQ">MCQ</option><option value="TEXT">Text</option><option value="CODE">Code</option></Select>
          </Field>
          <Field label="Prompt" error={errors.prompt?.message}>
            <Textarea className="min-h-24" {...register("prompt")} />
          </Field>
          {type === "MCQ" ? (
            <>
              <Field label="Options, one per line" error={errors.optionsText?.message}>
                <Textarea className="min-h-24" {...register("optionsText")} />
              </Field>
              <Field label="Correct answer" error={errors.correctAnswer?.message}>
                <Input {...register("correctAnswer")} />
              </Field>
            </>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Points" error={errors.points?.message}><Input type="number" min={1} max={100} {...register("points")} /></Field>
            <Field label="Order" error={errors.order?.message}><Input type="number" min={1} {...register("order")} /></Field>
          </div>
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle className="animate-spin" size={16} /> : <Plus size={16} />}
            {isSubmitting ? "Adding..." : "Add question"}
          </Button>
        </form>
      )}
    </Card>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{label}<div className="mt-1.5">{children}</div>{error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}</label>;
}
