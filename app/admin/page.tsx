import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/admin-overview";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Live platform statistics and operational charts for DevAssess administrators.",
};

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Admin console</p>
      <h1 className="mt-1 text-3xl font-bold">Platform overview</h1>
      <p className="mt-2 text-[var(--muted)]">Monitor real users, assessments, attempts and payment activity.</p>
      <AdminOverview />
    </main>
  );
}
