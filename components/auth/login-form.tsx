"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LockKeyhole, Shield, UserRound, Wrench } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authRequest } from "@/lib/api";
import type { ApiResponse, Role, User } from "@/types";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof schema>;
type LoginData = { accessToken: string; refreshToken: string; user: User };

const demos: Array<{
  role: Role;
  label: string;
  description: string;
  email: string;
  password: string;
  icon: typeof Shield;
}> = [
  {
    role: "ADMIN",
    label: "Admin",
    description: "Users, analytics & audit logs",
    email: "admin@devassess.com",
    password: "Admin123!",
    icon: Shield,
  },
  {
    role: "CANDIDATE",
    label: "Candidate",
    description: "Assessments, payments & attempts",
    email: "candidate@devassess.com",
    password: "Candidate123!",
    icon: UserRound,
  },
  {
    role: "REVIEWER",
    label: "Reviewer",
    description: "Authoring, queue & evaluation",
    email: "reviewer@devassess.com",
    password: "Reviewer123!",
    icon: Wrench,
  },
];

function destinationFor(role: Role) {
  if (role === "ADMIN") return "/admin";
  if (role === "REVIEWER") return "/reviewer";
  return "/dashboard";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSessionUser } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "candidate@devassess.com",
      password: "Candidate123!",
    },
  });

  async function authenticate(values: LoginValues) {
    const response = await authRequest<ApiResponse<LoginData>>("login", {
      method: "POST",
      body: JSON.stringify(values),
    });

    setSessionUser(response.data.user);
    const requested = searchParams.get("next");
    const fallback = destinationFor(response.data.user.role);
    const destination = requested?.startsWith("/") ? requested : fallback;
    toast.success(`Signed in as ${response.data.user.role.toLowerCase()}`);
    router.replace(destination);
    router.refresh();
  }

  async function onSubmit(values: LoginValues) {
    try {
      await authenticate(values);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in");
    }
  }

  async function demoLogin(role: Role) {
    const demo = demos.find((item) => item.role === role);
    if (!demo) return;

    setValue("email", demo.email);
    setValue("password", demo.password);

    try {
      await authenticate({ email: demo.email, password: demo.password });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Demo login failed");
    }
  }

  return (
    <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-6 sm:p-8">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--muted-bg)] text-[var(--primary)]">
          <LockKeyhole size={20} />
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">Welcome back 👋</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Login to your DevAssess account.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block text-sm font-semibold">
            Email
            <Input className="mt-1.5" type="email" autoComplete="email" {...register("email")} />
            {errors.email ? <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span> : null}
          </label>
          <label className="block text-sm font-semibold">
            Password
            <Input className="mt-1.5" type="password" autoComplete="current-password" {...register("password")} />
            {errors.password ? <span className="mt-1 block text-xs text-red-600">{errors.password.message}</span> : null}
          </label>
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle className="animate-spin" size={16} /> : <LockKeyhole size={16} />}
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </form>
      </Card>

      <Card className="p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">Quick Demo Login</p>
        <h2 className="mt-2 text-2xl font-bold">One click. Three roles.</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Evaluators can authenticate instantly with a seeded account and land on the matching role dashboard.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {demos.map(({ role, label, description, icon: Icon }) => (
            <button
              key={role}
              type="button"
              disabled={isSubmitting}
              onClick={() => void demoLogin(role)}
              className="group flex min-h-28 items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] p-4 text-left transition hover:border-[var(--primary)] hover:bg-[var(--muted-bg)] disabled:opacity-50"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--muted-bg)] text-[var(--primary)]">
                <Icon size={18} />
              </span>
              <span>
                <span className="block font-bold">{label}</span>
                <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{description}</span>
                <span className="mt-3 block text-sm font-semibold text-[var(--primary)]">Demo Login →</span>
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
