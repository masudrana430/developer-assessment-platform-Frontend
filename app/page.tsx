import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, TimerReset, UsersRound, ShieldCheck, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  { icon: TimerReset, title: "Timed assessments", text: "Candidates start secure, timed attempts with auto-saved answers." },
  { icon: CreditCard, title: "Stripe Checkout", text: "Paid assessments use a real Stripe-hosted checkout workflow." },
  { icon: UsersRound, title: "Three clear roles", text: "Purpose-built experiences for Candidates, Reviewers and Admins." },
  { icon: BadgeCheck, title: "Structured grading", text: "MCQs are auto-scored while reviewers grade subjective responses." },
  { icon: ShieldCheck, title: "Protected workflows", text: "Role checks, state transitions and audit trails are enforced by the API." },
  { icon: BarChart3, title: "Operational visibility", text: "Admin statistics and audit logs make the platform easy to supervise." },
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-sm font-semibold text-[var(--primary)]">
              Developer Assessment Platform
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Assess developer skills with a simple end-to-end workflow.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Browse assessments, pay securely, complete timed attempts, receive reviewer feedback and manage the platform from one responsive interface.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/assessments" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white">
                Browse assessments <ArrowRight size={18} />
              </Link>
              <Link href="/register" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-3 font-semibold">
                Create candidate account
              </Link>
            </div>
          </div>

          <Card className="p-6 sm:p-8">
            <p className="text-sm font-semibold text-[var(--primary)]">Workflow</p>
            <div className="mt-5 space-y-5">
              {["Choose a published assessment", "Enroll and complete Stripe payment", "Start the timed attempt", "Submit answers for review", "Receive score, decision and feedback"].map((step, index) => (
                <div key={step} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--muted-bg)] text-sm font-bold">{index + 1}</span>
                  <div>
                    <p className="font-semibold">{step}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--muted-bg)]">
                      <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${(index + 1) * 20}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <Icon className="text-[var(--primary)]" size={22} />
              <h2 className="mt-4 text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
