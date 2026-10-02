"use client";

import dynamic from "next/dynamic";
import {
  BadgeCheck,
  CreditCard,
  FileCheck2,
  TimerReset,
  Workflow,
} from "lucide-react";
import useSmallDevice from "@/hooks/use-small-device";

const DesktopPlatformPulse = dynamic(
  () => import("@/components/home/platform-pulse"),
  { ssr: false },
);

const states = [
  ["PENDING_PAYMENT", "Payment", CreditCard],
  ["READY", "Ready", FileCheck2],
  ["IN_PROGRESS", "Attempt", TimerReset],
  ["UNDER_REVIEW", "Review", Workflow],
  ["EVALUATED", "Evaluated", BadgeCheck],
] as const;

export default function PlatformPulseResponsive() {
  const small = useSmallDevice();

  if (small === false) {
    return <DesktopPlatformPulse />;
  }

  return (
    <section className="px-4 py-14">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
          Platform pulse
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Attempt states, without the background animation.
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          The same workflow states are shown in a lightweight mobile view.
        </p>

        <div className="mt-6 grid gap-3">
          {states.map(([code, label, Icon]) => (
            <div
              key={code}
              className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">{label}</p>
                <p className="mt-1 break-all text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                  {code}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
