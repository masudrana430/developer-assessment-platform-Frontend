"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Search,
  Send,
  TimerReset,
} from "lucide-react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

const steps = [
  {
    title: "Discover",
    text: "Browse published assessments and choose the right challenge.",
    Icon: Search,
    colors: [
      [37, 99, 235],
      [34, 211, 238],
    ] as [number, number, number][],
    speed: 3.4,
  },
  {
    title: "Enroll & pay",
    text: "Create an attempt and complete Stripe Checkout when payment is required.",
    Icon: CreditCard,
    colors: [
      [14, 165, 233],
      [99, 102, 241],
    ] as [number, number, number][],
    speed: 4.1,
  },
  {
    title: "Execute",
    text: "Start the backend-timed attempt and save answers as you work.",
    Icon: TimerReset,
    colors: [
      [59, 130, 246],
      [168, 85, 247],
    ] as [number, number, number][],
    speed: 3.1,
  },
  {
    title: "Submit",
    text: "Lock the attempt and send it into the review workflow.",
    Icon: Send,
    colors: [
      [6, 182, 212],
      [37, 99, 235],
    ] as [number, number, number][],
    speed: 4.6,
  },
  {
    title: "Evaluate",
    text: "Receive automatic MCQ scoring plus reviewer feedback for subjective answers.",
    Icon: BadgeCheck,
    colors: [
      [16, 185, 129],
      [34, 211, 238],
    ] as [number, number, number][],
    speed: 3.7,
  },
];

function CornerPlus({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "pointer-events-none absolute z-30 grid h-5 w-5 place-items-center text-[15px] font-light text-slate-400 transition-colors duration-200 group-hover/canvas-card:text-cyan-100 group-focus-within/canvas-card:text-cyan-100",
        className,
      ].join(" ")}
    >
      +
    </span>
  );
}

export default function AssessmentJourney() {
  const [active, setActive] = useState<number | null>(null);

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
            {steps.map(({ title, text, Icon, colors, speed }, index) => {
              const revealed = active === index;

              return (
                <article
                  key={title}
                  tabIndex={0}
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() =>
                    setActive((current) => (current === index ? null : current))
                  }
                  onFocus={() => setActive(index)}
                  onBlur={() =>
                    setActive((current) => (current === index ? null : current))
                  }
                  className="group/canvas-card relative min-h-[17.5rem] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]/78 p-5 outline-none transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-xl hover:shadow-blue-950/10 focus-visible:-translate-y-1 focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <CornerPlus className="-left-2.5 -top-2.5" />
                  <CornerPlus className="-right-2.5 -top-2.5" />
                  <CornerPlus className="-bottom-2.5 -left-2.5" />
                  <CornerPlus className="-bottom-2.5 -right-2.5" />

                  <div
                    className={[
                      "absolute inset-0 z-0 bg-[#06101f] transition-opacity duration-300",
                      revealed ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    <CanvasRevealEffect
                      active={revealed}
                      animationSpeed={speed}
                      colors={colors}
                      dotSize={2}
                      containerClassName="bg-[#06101f]"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,7,18,0.12)_48%,rgba(3,7,18,0.76)_100%)]" />
                  </div>

                  <div className="relative z-20 flex h-full min-h-[15rem] flex-col">
                    <div className="flex items-start justify-between">
                      <div
                        className={[
                          "grid h-12 w-12 place-items-center rounded-2xl border shadow-lg transition-all duration-300",
                          revealed
                            ? "-translate-y-1 border-white/15 bg-white/10 text-white shadow-cyan-500/10 backdrop-blur"
                            : "border-blue-500/10 bg-blue-600 text-white shadow-blue-500/20",
                        ].join(" ")}
                      >
                        <Icon size={20} />
                      </div>

                      <span
                        className={[
                          "text-xs font-bold uppercase tracking-[0.16em] transition-colors duration-300",
                          revealed ? "text-cyan-100/70" : "text-[var(--muted)]",
                        ].join(" ")}
                      >
                        0{index + 1}
                      </span>
                    </div>

                    <div className="mt-auto pt-8">
                      <h3
                        className={[
                          "text-lg font-bold transition-all duration-300",
                          revealed
                            ? "-translate-y-1 text-white"
                            : "text-[var(--foreground)]",
                        ].join(" ")}
                      >
                        {title}
                      </h3>

                      <p
                        className={[
                          "mt-2 text-sm leading-6 transition-all duration-300",
                          revealed
                            ? "-translate-y-1 text-slate-200"
                            : "text-[var(--muted)]",
                        ].join(" ")}
                      >
                        {text}
                      </p>

                      <div
                        className={[
                          "mt-5 h-1 overflow-hidden rounded-full transition-colors duration-300",
                          revealed ? "bg-white/10" : "bg-[var(--muted-bg)]",
                        ].join(" ")}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-300 to-emerald-300 transition-all duration-500"
                          style={{
                            width: revealed
                              ? "100%"
                              : String(28 + index * 13) + "%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="relative mt-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Hover or focus a step to reveal the workflow field
          </p>
        </div>
      </div>
    </section>
  );
}
