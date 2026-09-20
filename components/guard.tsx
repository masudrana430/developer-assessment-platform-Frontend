"use client";

import Link from "next/link";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import type { Role } from "@/types";

export function RequireAuth({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: Role[];
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-7xl items-center justify-center px-4">
        <LoaderCircle className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <LockKeyhole className="mb-4 text-[var(--primary)]" size={36} />
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <p className="mt-2 text-[var(--muted)]">Please sign in to continue.</p>
        <Link className="mt-5 rounded-xl bg-[var(--primary)] px-5 py-2.5 font-semibold text-white" href="/login">
          Sign in
        </Link>
      </div>
    );
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <LockKeyhole className="mb-4 text-amber-500" size={36} />
        <h1 className="text-2xl font-bold">Access restricted</h1>
        <p className="mt-2 text-[var(--muted)]">Your account role cannot access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
