"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CreditCard,
  FileCheck2,
  TimerReset,
  Workflow,
} from "lucide-react";

const states = [
  {
    code: "PENDING_PAYMENT",
    label: "Payment",
    text: "Stripe Checkout is required before the attempt becomes ready.",
    Icon: CreditCard,
  },
  {
    code: "READY",
    label: "Ready",
    text: "Payment or enrollment requirements are satisfied.",
    Icon: FileCheck2,
  },
  {
    code: "IN_PROGRESS",
    label: "Attempt",
    text: "The candidate is inside the timed execution state.",
    Icon: TimerReset,
  },
  {
    code: "UNDER_REVIEW",
    label: "Review",
    text: "Submitted subjective responses can be handled by a reviewer.",
    Icon: Workflow,
  },
  {
    code: "EVALUATED",
    label: "Evaluated",
    text: "Scoring and feedback are available to the candidate.",
    Icon: BadgeCheck,
  },
];

export default function PlatformPulse() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % states.length);
    }, 2100);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
          <div className="border-b border-[var(--border)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
              Platform pulse
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Watch the attempt state machine move.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
              This is an illustrative state visualization, not live telemetry. It mirrors the attempt states used by the application.
            </p>

            <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                Current visual state
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                <span className="font-bold">{states[active].code}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {states[active].text}
              </p>
            </div>
          </div>

          <div className="relative p-5 sm:p-8">
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-1/2 hidden h-px bg-gradient-to-r from-transparent via-blue-400/35 to-transparent sm:block" />
            <div className="relative grid gap-3 sm:grid-cols-5">
              {states.map(({ code, label, Icon }, index) => {
                const selected = active === index;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setActive(index)}
                    className={[
                      "relative rounded-2xl border p-4 text-left transition duration-300",
                      selected
                        ? "scale-[1.02] border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                        : "border-[var(--border)] bg-[var(--background)] hover:border-blue-300/60",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "grid h-10 w-10 place-items-center rounded-xl transition",
                        selected
                          ? "bg-blue-600 text-white"
                          : "bg-[var(--muted-bg)] text-[var(--muted)]",
                      ].join(" ")}
                    >
                      <Icon size={18} />
                    </div>
                    <p className="mt-4 text-sm font-bold">{label}</p>
                    <p className="mt-1 break-all text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                      {code}
                    </p>
                    {selected ? (
                      <div className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
