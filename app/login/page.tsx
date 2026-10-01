import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Skeleton } from "@/components/ui/skeleton";
import LoginLiquidBackground from "@/components/auth/login-liquid-background";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to DevAssess or use one-click demo login for Candidate, Reviewer and Admin roles.",
};

export default function LoginPage() {
  return (
    <main className="relative isolate min-h-[calc(100vh-65px)] overflow-hidden">
      <LoginLiquidBackground />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-65px)] w-full max-w-7xl flex-col items-center justify-center px-4 py-10 sm:px-6">
        <Suspense fallback={<Skeleton className="h-[34rem] w-full max-w-5xl" />}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          New candidate? <Link className="font-semibold text-[var(--primary)]" href="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
