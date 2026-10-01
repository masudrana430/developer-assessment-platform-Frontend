import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  BadgeCheck,
  Clock3,
  CreditCard,
  Search,
  Shield,
  UserCog,
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore the candidate, reviewer and admin capabilities available in DevAssess.",
};

const features = [
  {
    title: "Assessment discovery",
    description:
      "Search, filter and sort published assessments with shareable URL state.",
    icon: <Search className="h-4 w-4 text-slate-950 dark:text-slate-300" />,
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/4]",
  },
  {
    title: "Timed attempts",
    description:
      "Start a backend-timed assessment and save answers before final submission.",
    icon: <Clock3 className="h-4 w-4 text-slate-950 dark:text-slate-300" />,
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/4]",
  },
  {
    title: "Stripe Checkout",
    description:
      "Paid assessments use real Stripe test-mode Checkout and signed webhooks.",
    icon: <CreditCard className="h-4 w-4 text-slate-950 dark:text-slate-300" />,
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/4/3/7]",
  },
  {
    title: "Structured review",
    description:
      "MCQs are auto-scored while reviewers grade subjective answers and add feedback.",
    icon: <BadgeCheck className="h-4 w-4 text-slate-950 dark:text-slate-300" />,
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/7/2/10]",
  },
  {
    title: "Role-based management",
    description:
      "Reviewer and Admin screens expose only the actions appropriate to each role.",
    icon: <UserCog className="h-4 w-4 text-slate-950 dark:text-slate-300" />,
    area: "md:[grid-area:3/1/4/7] xl:[grid-area:1/10/2/13]",
  },
  {
    title: "Audit-friendly administration",
    description:
      "Admins can inspect users, platform statistics and audit-log activity.",
    icon: <Shield className="h-4 w-4 text-slate-950 dark:text-slate-300" />,
    area: "md:[grid-area:3/7/4/13] xl:[grid-area:2/7/3/13]",
  },
];

interface GridItemProps {
  area: string;
  icon: ReactNode;
  title: string;
  description: ReactNode;
}

function GridItem({ area, icon, title, description }: GridItemProps) {
  return (
    <li className={`group min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border border-[var(--border)] p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          movementDuration={1.4}
          borderWidth={1.5}
        />

        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border border-transparent bg-[var(--card)]/92 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.04)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 dark:bg-[#0d1627]/92 dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.55)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(37,99,235,0.08),transparent_36%),radial-gradient(circle_at_90%_90%,rgba(34,211,238,0.05),transparent_34%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative flex flex-1 flex-col justify-between gap-4">
            <div className="w-fit rounded-lg border border-slate-300/80 bg-white/70 p-2 shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/[0.05]">
              {icon}
            </div>

            <div className="space-y-3">
              <h2 className="text-balance font-sans text-xl font-semibold leading-[1.375rem] tracking-tight text-slate-950 md:text-2xl md:leading-[1.875rem] dark:text-white">
                {title}
              </h2>
              <p className="font-sans text-sm leading-[1.4rem] text-slate-600 md:text-base dark:text-slate-400">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
          Platform features
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Everything needed for the assessment lifecycle.
        </h1>
        <p className="mt-4 leading-7 text-[var(--muted)]">
          Each capability below maps to the live Developer Assessment Platform
          workflow rather than a decorative mock feature.
        </p>
      </div>

      <ul className="mt-10 grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:grid-rows-2">
        {features.map((feature) => (
          <GridItem
            key={feature.title}
            area={feature.area}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </ul>

      <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        Move your cursor around the cards to trace the glowing border
      </p>
    </main>
  );
}
