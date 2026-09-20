"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { ApiResponse, User } from "@/types";

type LoginData = { accessToken: string; refreshToken: string; user: User };

const demos = [
  ["Candidate", "candidate@devassess.com", "Candidate123!"],
  ["Reviewer", "reviewer@devassess.com", "Reviewer123!"],
  ["Admin", "admin@devassess.com", "Admin123!"],
] as const;

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("candidate@devassess.com");
  const [password, setPassword] = useState("Candidate123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest<ApiResponse<LoginData>>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSession(response.data);
      const destination =
        response.data.user.role === "ADMIN"
          ? "/admin"
          : response.data.user.role === "REVIEWER"
            ? "/reviewer"
            : "/dashboard";
      router.push(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--muted-bg)] text-[var(--primary)]"><LogIn size={20} /></div>
        <h1 className="mt-5 text-2xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Sign in with your Candidate, Reviewer or Admin account.</p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {demos.map(([label, demoEmail, demoPassword]) => (
            <button key={label} type="button" onClick={() => { setEmail(demoEmail); setPassword(demoPassword); }} className="rounded-lg border border-[var(--border)] px-2 py-2 text-xs font-semibold hover:bg-[var(--muted-bg)]">
              {label}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">Email<Input className="mt-1.5" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label className="block text-sm font-semibold">Password<Input className="mt-1.5" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          {error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-600">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">New candidate? <Link className="font-semibold text-[var(--primary)]" href="/register">Create an account</Link></p>
      </Card>
    </main>
  );
}
