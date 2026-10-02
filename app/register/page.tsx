import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import AuthRibbonBackground from "@/components/auth/auth-ribbon-background-responsive";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a DevAssess Candidate account with backend-matched validation.",
};

export default function RegisterPage() {
  return (
    <main className="relative isolate min-h-[calc(100vh-65px)] overflow-hidden">
      <AuthRibbonBackground />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-65px)] w-full max-w-7xl flex-col items-center justify-center px-4 py-10 sm:px-6">
        <RegisterForm />
        <p className="auth-glass-chip mt-6 rounded-full px-4 py-2 text-center text-sm text-[var(--muted)]">
          Already registered? <Link className="font-semibold text-[var(--primary)]" href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
