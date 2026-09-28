import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminAudit } from "@/components/admin/admin-audit";
import { PageSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Audit Logs",
  description: "Search the backend audit trail by action and entity type.",
};

export default function AdminAuditPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Admin · Reports</p>
      <h1 className="mt-1 text-3xl font-bold">Audit logs</h1>
      <p className="mt-2 text-[var(--muted)]">Inspect critical backend actions with URL-synchronized filters.</p>
      <Suspense fallback={<PageSkeleton />}><AdminAudit /></Suspense>
    </main>
  );
}
