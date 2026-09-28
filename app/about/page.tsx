import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck, Workflow } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "How DevAssess connects candidates, reviewers and administrators in one assessment workflow.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">About DevAssess</p>
      <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
        A practical workflow for real developer assessments.
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)]">
        DevAssess is built around three fixed roles: Candidates take assessments, Reviewers create and evaluate them, and Admins supervise users and platform activity.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Card>
          <Workflow className="text-[var(--primary)]" />
          <h2 className="mt-4 text-lg font-bold">Clear state transitions</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Enrollment, payment, timed execution, submission and evaluation follow backend-enforced states.
          </p>
        </Card>
        <Card>
          <ShieldCheck className="text-[var(--primary)]" />
          <h2 className="mt-4 text-lg font-bold">Role-aware access</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Middleware and the API both enforce who can access candidate, reviewer and admin functionality.
          </p>
        </Card>
        <Card>
          <CheckCircle2 className="text-[var(--primary)]" />
          <h2 className="mt-4 text-lg font-bold">Real integrations</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            The frontend connects to the deployed API, Stripe Checkout, Cloudinary-backed avatars and audited backend workflows.
          </p>
        </Card>
      </div>
    </main>
  );
}
