"use client";

import Link from "next/link";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Search,
  Send,
  TimerReset,
  type LucideIcon,
} from "lucide-react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

type JourneyStep = {
  title: string;
  text: string;
  Icon: LucideIcon;
  colors: number[][];
  speed: number;
  containerClassName: string;
};

const steps: JourneyStep[] = [
  {
    title: "Discover",
    text: "Browse published assessments and choose the right challenge.",
    Icon: Search,
    colors: [[34, 211, 238]],
    speed: 5.1,
    containerClassName: "bg-sky-950",
  },
  {
    title: "Enroll & pay",
    text: "Create an attempt and complete Stripe Checkout when payment is required.",
    Icon: CreditCard,
    colors: [
      [59, 130, 246],
      [99, 102, 241],
    ],
    speed: 3,
    containerClassName: "bg-blue-950",
  },
  {
    title: "Execute",
    text: "Start the backend-timed attempt and save answers as you work.",
    Icon: TimerReset,
    colors: [
      [99, 102, 241],
      [168, 85, 247],
    ],
    speed: 3,
    containerClassName: "bg-indigo-950",
  },
  {
    title: "Submit",
    text: "Lock the attempt and send it into the review workflow.",
    Icon: Send,
    colors: [
      [14, 165, 233],
      [34, 211, 238],
    ],
    speed: 4,
    containerClassName: "bg-cyan-950",
  },
  {
    title: "Evaluate",
    text: "Receive automatic MCQ scoring plus reviewer feedback for subjective answers.",
    Icon: BadgeCheck,
    colors: [
      [16, 185, 129],
      [34, 211, 238],
    ],
    speed: 3.5,
    containerClassName: "bg-emerald-950",
  },
];

function CornerIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
}

function JourneyCard({
  step,
  index,
}: {
  step: JourneyStep;
  index: number;
}) {
  const [hovered, setHovered] = React.useState(false);
  const Icon = step.Icon;

  return (
    <article
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group/canvas-card relative flex min-h-[22rem] w-full items-center justify-center overflow-hidden border border-[var(--border)] bg-[var(--background)]/80 p-5 outline-none transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-2xl hover:shadow-blue-950/10 focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      <CornerIcon className="absolute -left-3 -top-3 z-30 h-6 w-6 text-[var(--muted)] transition-colors group-hover/canvas-card:text-white" />
      <CornerIcon className="absolute -bottom-3 -left-3 z-30 h-6 w-6 text-[var(--muted)] transition-colors group-hover/canvas-card:text-white" />
      <CornerIcon className="absolute -right-3 -top-3 z-30 h-6 w-6 text-[var(--muted)] transition-colors group-hover/canvas-card:text-white" />
      <CornerIcon className="absolute -bottom-3 -right-3 z-30 h-6 w-6 text-[var(--muted)] transition-colors group-hover/canvas-card:text-white" />

      <span
        className={[
          "absolute right-4 top-4 z-30 text-xs font-bold uppercase tracking-[0.16em] transition-colors duration-200",
          hovered ? "text-white/70" : "text-[var(--muted)]",
        ].join(" ")}
      >
        0{index + 1}
      </span>

      <AnimatePresence>
        {hovered ? (
          <motion.div
            key="canvas-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 h-full w-full"
          >
            <CanvasRevealEffect
              animationSpeed={step.speed}
              containerClassName={step.containerClassName}
              colors={step.colors}
              dotSize={2}
            />
            <div className="absolute inset-0 bg-black/20 [mask-image:radial-gradient(360px_at_center,white,transparent)] dark:bg-black/35" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative z-20 flex min-h-[18rem] w-full flex-col items-center justify-center text-center">
        <div
          className={[
            "grid h-14 w-14 place-items-center rounded-2xl border transition-all duration-200",
            hovered
              ? "-translate-y-5 scale-90 border-white/20 bg-white/10 text-white opacity-0"
              : "border-blue-500/15 bg-blue-600 text-white shadow-lg shadow-blue-500/20",
          ].join(" ")}
        >
          <Icon size={23} />
        </div>

        <div
          className={[
            "absolute inset-x-0 top-1/2 px-2 transition-all duration-200",
            hovered
              ? "-translate-y-1/2 opacity-100"
              : "translate-y-2 opacity-0",
          ].join(" ")}
        >
          <h3 className="text-xl font-bold text-white">{step.title}</h3>
          <p className="mx-auto mt-3 max-w-[15rem] text-sm leading-6 text-slate-200">
            {step.text}
          </p>
          <div className="mx-auto mt-5 h-1 w-20 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300" />
          </div>
        </div>

        <div
          className={[
            "mt-5 transition-all duration-200",
            hovered ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100",
          ].join(" ")}
        >
          <h3 className="text-lg font-bold text-[var(--foreground)]">
            {step.title}
          </h3>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Step {index + 1}
          </p>
        </div>
      </div>
    </article>
  );
}

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

          <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {steps.map((step, index) => (
              <JourneyCard key={step.title} step={step} index={index} />
            ))}
          </div>

          <p className="relative mt-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Hover or focus a step to reveal the workflow
          </p>
        </div>
      </div>
    </section>
  );
}
