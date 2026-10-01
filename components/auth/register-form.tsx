"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authRequest } from "@/lib/api";
import type { ApiResponse, User } from "@/types";

const schema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters").max(80),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72)
    .regex(/[A-Z]/, "Add at least one uppercase letter")
    .regex(/[a-z]/, "Add at least one lowercase letter")
    .regex(/[0-9]/, "Add at least one number"),
});

type RegisterValues = z.infer<typeof schema>;
type RegisterData = { accessToken: string; refreshToken: string; user: User };

export function RegisterForm() {
  const router = useRouter();
  const { setSessionUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onBlur",
  });

  async function onSubmit(values: RegisterValues) {
    try {
      const response = await authRequest<ApiResponse<RegisterData>>("register", {
        method: "POST",
        body: JSON.stringify(values),
      });
      setSessionUser(response.data.user);
      toast.success("Candidate account created");
      router.replace("/assessments");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    }
  }

  return (
    <Card className="auth-glass w-full max-w-lg p-6 sm:p-8">
      <span className="auth-glass-soft grid h-11 w-11 place-items-center rounded-xl border text-[var(--primary)]">
        <UserPlus size={20} />
      </span>
      <h1 className="mt-5 text-3xl font-bold tracking-tight">Create candidate account</h1>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Registration creates a real Candidate account through the deployed backend.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Name" error={errors.name?.message}>
          <Input className="auth-glass-input" autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input className="auth-glass-input" type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Input className="auth-glass-input" type="password" autoComplete="new-password" {...register("password")} />
        </Field>
        <Button className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="animate-spin" size={16} /> : <UserPlus size={16} />}
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </Card>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <div className="mt-1.5">{children}</div>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
