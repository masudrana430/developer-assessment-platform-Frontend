import type { Metadata } from "next";
import { CandidateDashboard } from "@/components/candidate/dashboard-client";

export const metadata: Metadata = {
  title: "Candidate Dashboard",
  description: "Candidate activity, assessment attempts and payment shortcuts.",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <CandidateDashboard />
    </main>
  );
}
