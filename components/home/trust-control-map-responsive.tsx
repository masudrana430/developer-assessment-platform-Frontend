"use client";

import dynamic from "next/dynamic";
import {
  BadgeCheck,
  CreditCard,
  FileClock,
  KeyRound,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import useSmallDevice from "@/hooks/use-small-device";

const DesktopTrustControlMap = dynamic(
  () => import("@/components/home/trust-control-map"),
  { ssr: false },
);

type Control = {
  title: string;
  text: string;
  Icon: LucideIcon;
};

const controls: Control[] = [
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
    text: "Paid attempts are confirmed before becoming ready.",
    Icon: CreditCard,
  },
  {
    title: "Reviewer claim",
    text: "Submitted work uses an atomic claim operation.",
    Icon: BadgeCheck,
  },
  {
    title: "Audit logs",
    text: "Admins can inspect security-sensitive activity.",
    Icon: FileClock,
  },
];

export default function TrustControlMapResponsive() {
  const small = useSmallDevice();

  if (small === false) {
    return <DesktopTrustControlMap />;
  }

  return (
    <section className="px-4 py-14">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
          Trust & control
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Important workflow controls stay connected.
        </h2>

        <div className="mt-7 rounded-[2rem] border border-[var(--border)] bg-[#071426] p-5 text-white">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.08] text-cyan-100">
              <ShieldCheck size={21} />
            </div>
            <div>
              <p className="font-bold">DevAssess control layer</p>
              <p className="mt-1 text-xs text-slate-400">Lightweight mobile view</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {controls.map(({ title, text, Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-cyan-100">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-400">{text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
