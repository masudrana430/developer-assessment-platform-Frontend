"use client";

import {
  BadgeCheck,
  CreditCard,
  FileClock,
  KeyRound,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import TrustCursorBackground from "@/components/home/trust-cursor-background";

const controls = [
  {
    title: "Role checks",
    text: "Candidate, Reviewer and Admin experiences expose role-appropriate actions.",
    Icon: KeyRound,
  },
  {
    title: "State transitions",
    text: "Attempt progression follows explicit backend-controlled statuses.",
    Icon: Workflow,
  },
  {
    title: "Stripe webhooks",
    text: "Paid attempts are confirmed through the payment workflow before becoming ready.",
    Icon: CreditCard,
  },
  {
    title: "Reviewer claim",
    text: "Submitted work uses an atomic claim operation to avoid duplicate assignment.",
    Icon: BadgeCheck,
  },
  {
    title: "Audit logs",
    text: "Admins can inspect recorded security-sensitive activity.",
    Icon: FileClock,
  },
];

export default function TrustControlMap() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            Trust & control
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Important workflow controls stay connected.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
            DevAssess combines role-aware access, payment confirmation, explicit state changes, reviewer assignment and audit visibility into one workflow.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[#071426] p-6 text-white shadow-2xl shadow-blue-950/15 sm:p-8 lg:p-10">
          <TrustCursorBackground />

          <div className="relative z-10 grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div className="relative mx-auto grid h-64 w-64 place-items-center sm:h-72 sm:w-72">
              <div className="absolute inset-5 rounded-full border border-dashed border-cyan-200/20 animate-[spin_24s_linear_infinite]" />
              <div className="absolute inset-12 rounded-full border border-blue-300/15 animate-[spin_18s_linear_infinite_reverse]" />
              <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-2xl" />

              <div className="relative grid h-32 w-32 place-items-center rounded-full border border-cyan-100/20 bg-white/[0.08] text-center shadow-[0_0_70px_rgba(37,99,235,0.25)] backdrop-blur-xl">
                <div>
                  <ShieldCheck className="mx-auto text-cyan-200" size={30} />
                  <p className="mt-2 text-sm font-bold">DevAssess</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    Control layer
                  </p>
                </div>
              </div>

              {[0, 72, 144, 216, 288].map((rotation) => (
                <div
                  key={rotation}
                  className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]"
                  style={{
                    transform:
                      "translate(-50%, -50%) rotate(" +
                      rotation +
                      "deg) translateY(-118px)",
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {controls.map(({ title, text, Icon }, index) => (
                <article
                  key={title}
                  className={[
                    "group rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-100/25 hover:bg-white/[0.10]",
                    index === controls.length - 1 ? "sm:col-span-2" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.08] text-cyan-100">
                      <Icon size={19} />
                    </div>
                    <div>
                      <h3 className="font-bold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
