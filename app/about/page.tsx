import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, UsersRound } from "lucide-react";
import { AboutCapabilityGrid } from "@/components/about/about-capability-grid";

export const metadata: Metadata = {
  title: "About",
  description: "How DevAssess connects candidates, reviewers and administrators in one structured assessment workflow.",
};

const roles = [
  {
    title: "Candidate",
    text: "Discover assessments, enroll, complete payment when required, take timed attempts and receive results.",
    Icon: CheckCircle2,
  },
  {
    title: "Reviewer",
    text: "Create assessments, manage questions and evaluate subjective responses through a focused review workflow.",
    Icon: UsersRound,
  },
  {
    title: "Administrator",
    text: "Supervise users, roles, platform activity and audit visibility from the administration experience.",
    Icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.12fr_.88fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
                About DevAssess
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                One structured system for the complete developer assessment journey.
              </h1>
            </div>

            <div className="lg:pb-1">
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                DevAssess connects candidates, reviewers and administrators through a single workflow that covers assessment discovery, enrollment, timed execution, evaluation and platform oversight.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/assessments"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                >
                  Explore assessments <ArrowRight size={17} />
                </Link>
                <Link
                  href="/features"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--muted-bg)]"
                >
                  View platform features
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 grid overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] sm:grid-cols-3">
            {roles.map(({ title, text, Icon }, index) => (
              <div
                key={title}
                className={[
                  "p-6 sm:p-7",
                  index > 0 ? "border-t border-[var(--border)] sm:border-l sm:border-t-0" : "",
                ].join(" ")}
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--muted-bg)] text-[var(--primary)]">
                  <Icon size={19} />
                </div>
                <h2 className="mt-5 text-lg font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--primary)]">Inside the platform</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Built as one connected assessment workflow.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
              Move your pointer into any panel from a different edge. The directional reveal mirrors how each part of DevAssess connects into the wider platform.
            </p>
          </div>

          <AboutCapabilityGrid />

          <div className="mt-8 flex items-center justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
            <div>
              <p className="font-bold">Ready to see the workflow in action?</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Browse the currently published assessments and follow the candidate journey from enrollment onward.
              </p>
            </div>
            <Link
              href="/assessments"
              className="hidden shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--muted-bg)] sm:inline-flex"
            >
              Browse assessments <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
