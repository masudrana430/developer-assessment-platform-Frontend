import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Search,
  Send,
  TimerReset,
} from "lucide-react";

const steps = [
  {
    title: "Discover",
    text: "Browse published assessments and choose the right challenge.",
    Icon: Search,
  },
  {
    title: "Enroll & pay",
    text: "Create an attempt and complete Stripe Checkout when payment is required.",
    Icon: CreditCard,
  },
  {
    title: "Execute",
    text: "Start the backend-timed attempt and save answers as you work.",
    Icon: TimerReset,
  },
  {
    title: "Submit",
    text: "Lock the attempt and send it into the review workflow.",
    Icon: Send,
  },
  {
    title: "Evaluate",
    text: "Receive automatic MCQ scoring plus reviewer feedback for subjective answers.",
    Icon: BadgeCheck,
  },
];

export default function AssessmentJourney() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
              Assessment journey
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              One connected path from discovery to evaluation.
            </h2>
          </div>
          <Link
            href="/assessments"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
          >
            Browse assessments <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_90%_100%,rgba(34,211,238,0.08),transparent_28%)]" />
          <div className="pointer-events-none absolute left-[10%] right-[10%] top-[4.45rem] hidden h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent lg:block" />

          <div className="relative grid gap-4 lg:grid-cols-5">
            {steps.map(({ title, text, Icon }, index) => (
              <article
                key={title}
                className="group relative rounded-2xl border border-[var(--border)] bg-[var(--background)]/75 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-300/70 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
                <div className="mt-5 h-1 overflow-hidden rounded-full bg-[var(--muted-bg)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 group-hover:w-full"
                    style={{ width: String(28 + index * 13) + "%" }}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
