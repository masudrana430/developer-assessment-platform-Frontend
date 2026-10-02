"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Search,
  Send,
  TimerReset,
  type LucideIcon,
} from "lucide-react";
import useSmallDevice from "@/hooks/use-small-device";

const DesktopAssessmentJourney = dynamic(
  () => import("@/components/home/assessment-journey"),
  { ssr: false },
);

type Step = {
  title: string;
  text: string;
  Icon: LucideIcon;
};

const steps: Step[] = [
  {
    title: "Discover",
    text: "Browse published assessments and choose the right challenge.",
    Icon: Search,
  },
  {
    title: "Enroll & pay",
    text: "Create an attempt and complete Stripe Checkout when required.",
    Icon: CreditCard,
  },
  {
    title: "Execute",
    text: "Start the timed attempt and save answers as you work.",
    Icon: TimerReset,
  },
  {
    title: "Submit",
    text: "Lock the attempt and send it into the review workflow.",
    Icon: Send,
  },
  {
    title: "Evaluate",
    text: "Receive scoring plus reviewer feedback.",
    Icon: BadgeCheck,
  },
];

export default function AssessmentJourneyResponsive() {
  const small = useSmallDevice();

  if (small === false) {
    return <DesktopAssessmentJourney />;
  }

  return (
    <section className="px-4 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            Assessment journey
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            One connected path from discovery to evaluation.
          </h2>
          <Link
            href="/assessments"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
          >
            Browse assessments <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-3">
          {steps.map(({ title, text, Icon }, index) => (
            <article
              key={title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
                  <Icon size={19} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
