"use client";

import dynamic from "next/dynamic";
import {
  BadgeCheck,
  BarChart3,
  CreditCard,
  ShieldCheck,
  TimerReset,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import useSmallDevice from "@/hooks/use-small-device";

const DesktopFeatureMagicBento = dynamic(
  () => import("@/components/home/feature-magic-bento"),
  { ssr: false },
);

type MobileFeature = {
  label: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

const features: MobileFeature[] = [
  {
    label: "Assessment",
    title: "Timed assessments",
    description: "Secure timed attempts with auto-saved answers.",
    Icon: TimerReset,
  },
  {
    label: "Payments",
    title: "Stripe Checkout",
    description: "Paid assessments use a real Stripe-hosted checkout workflow.",
    Icon: CreditCard,
  },
  {
    label: "Access",
    title: "Three clear roles",
    description: "Focused experiences for Candidates, Reviewers and Admins.",
    Icon: UsersRound,
  },
  {
    label: "Evaluation",
    title: "Structured grading",
    description: "MCQs are auto-scored while subjective responses are reviewed.",
    Icon: BadgeCheck,
  },
  {
    label: "Security",
    title: "Protected workflows",
    description: "Role checks, state transitions and audit trails are API-enforced.",
    Icon: ShieldCheck,
  },
  {
    label: "Operations",
    title: "Operational visibility",
    description: "Admin statistics and audit logs make the platform easier to supervise.",
    Icon: BarChart3,
  },
];

export default function FeatureMagicBentoResponsive() {
  const small = useSmallDevice();

  if (small === false) {
    return <DesktopFeatureMagicBento />;
  }

  return (
    <div className="grid gap-3">
      {features.map(({ label, title, description, Icon }) => (
        <article
          key={title}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
              <Icon size={18} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
              {label}
            </p>
          </div>
          <h2 className="mt-4 text-xl font-bold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>
        </article>
      ))}
    </div>
  );
}
