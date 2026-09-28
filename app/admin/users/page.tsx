import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminUsers } from "@/components/admin/admin-users";
import { PageSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "User Management",
  description: "Admin user search, role and status management backed by the live API.",
};

export default function AdminUsersPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Admin · Resources</p>
      <h1 className="mt-1 text-3xl font-bold">User management</h1>
      <p className="mt-2 text-[var(--muted)]">Search, filter and manage user access. All filters are shareable through the URL.</p>
      <Suspense fallback={<PageSkeleton />}><AdminUsers /></Suspense>
    </main>
  );
}
