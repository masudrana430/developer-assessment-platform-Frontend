"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { ApiResponse, User } from "@/types";

type RegisterData = { accessToken: string; refreshToken: string; user: User };

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest<ApiResponse<RegisterData>>("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSession(response.data);
      router.push("/assessments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--muted-bg)] text-[var(--primary)]"><UserPlus size={20} /></div>
        <h1 className="mt-5 text-2xl font-bold">Create candidate account</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Passwords must include uppercase, lowercase and a number.</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold">Name<Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} minLength={2} required /></label>
          <label className="block text-sm font-semibold">Email<Input className="mt-1.5" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label className="block text-sm font-semibold">Password<Input className="mt-1.5" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} required /></label>
          {error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-600">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">Already registered? <Link className="font-semibold text-[var(--primary)]" href="/login">Sign in</Link></p>
      </Card>
    </main>
  );
}
