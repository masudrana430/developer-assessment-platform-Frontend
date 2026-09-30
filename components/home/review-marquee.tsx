"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  BadgeCheck,
  ClipboardCheck,
  CreditCard,
  ShieldCheck,
  TimerReset,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

type MarqueeProps = ComponentPropsWithoutRef<"div"> & {
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: ReactNode;
  vertical?: boolean;
  repeat?: number;
  ariaLabel?: string;
};

export function Marquee({
  className = "",
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 3,
  ariaLabel,
  ...props
}: MarqueeProps) {
  const directionClass = vertical ? "flex-col" : "flex-row";
  const animationClass = vertical ? "review-marquee-vertical" : "review-marquee-horizontal";

  return (
    <div
      {...props}
      className={[
        "group flex overflow-hidden [--duration:38s] [--gap:0.9rem] [gap:var(--gap)]",
        directionClass,
        className,
      ].join(" ")}
      aria-label={ariaLabel}
      role="region"
    >
      {Array.from({ length: repeat }, (_, index) => (
        <div
          key={index}
          className={[
            "flex shrink-0 justify-around [gap:var(--gap)]",
            directionClass,
            animationClass,
            pauseOnHover ? "group-hover:[animation-play-state:paused]" : "",
            reverse ? "[animation-direction:reverse]" : "",
          ].join(" ")}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

type Perspective = {
  role: string;
  handle: string;
  body: string;
  label: string;
  Icon: LucideIcon;
};

const perspectives: Perspective[] = [
  {
    role: "Candidate",
    handle: "Assessment flow",
    body: "Enrollment, payment, timed execution and submission are presented as one clear journey.",
    label: "Sample perspective",
    Icon: UsersRound,
  },
  {
    role: "Reviewer",
    handle: "Evaluation workflow",
    body: "Question management and structured grading keep reviewer work focused on the assessment itself.",
    label: "Sample perspective",
    Icon: ClipboardCheck,
  },
  {
    role: "Administrator",
    handle: "Platform oversight",
    body: "Role controls, user management and audit visibility make operational supervision easier to follow.",
    label: "Sample perspective",
    Icon: ShieldCheck,
  },
  {
    role: "Candidate",
    handle: "Timed attempt",
    body: "A visible countdown and saved answers make the in-progress assessment state predictable.",
    label: "Sample perspective",
    Icon: TimerReset,
  },
  {
    role: "Candidate",
    handle: "Secure checkout",
    body: "The payment step stays separate from the attempt flow and returns candidates to the correct state.",
    label: "Sample perspective",
    Icon: CreditCard,
  },
  {
    role: "Reviewer",
    handle: "Scoring",
    body: "Automatic MCQ scoring and reviewer-evaluated subjective answers create a practical hybrid grading model.",
    label: "Sample perspective",
    Icon: BadgeCheck,
  },
];

function PerspectiveCard({ role, handle, body, label, Icon }: Perspective) {
  return (
    <article className="w-56 rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-[0_16px_45px_rgba(37,99,235,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-[0_16px_45px_rgba(0,0,0,0.24)] sm:w-60">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-50">
            {role}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{handle}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{body}</p>

      <div className="mt-4 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">
        {label}
      </div>
    </article>
  );
}

export default function ReviewMarquee() {
  return (
    <div className="relative h-[430px] w-full overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-[0_24px_80px_rgba(37,99,235,0.08)] [perspective:380px] dark:bg-[#091221] dark:shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:h-[470px]">
      <div
        className="absolute left-1/2 top-1/2 flex w-[1120px] -translate-x-1/2 -translate-y-1/2 items-center gap-4 sm:w-[1220px]"
        style={{
          transform:
            "translate(-50%, -50%) translateX(-40px) translateZ(-105px) rotateX(18deg) rotateY(-9deg) rotateZ(8deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <Marquee vertical pauseOnHover repeat={3} className="h-[660px] [--duration:40s]" ariaLabel="Candidate and reviewer perspectives column one">
          {perspectives.map((item, index) => (
            <PerspectiveCard key={`one-${index}`} {...item} />
          ))}
        </Marquee>

        <Marquee vertical pauseOnHover reverse repeat={3} className="h-[660px] [--duration:44s]" ariaLabel="Candidate and reviewer perspectives column two">
          {[...perspectives].reverse().map((item, index) => (
            <PerspectiveCard key={`two-${index}`} {...item} />
          ))}
        </Marquee>

        <Marquee vertical pauseOnHover repeat={3} className="hidden h-[660px] [--duration:42s] sm:flex" ariaLabel="Candidate and reviewer perspectives column three">
          {perspectives.map((item, index) => (
            <PerspectiveCard key={`three-${index}`} {...item} />
          ))}
        </Marquee>

        <Marquee vertical pauseOnHover reverse repeat={3} className="hidden h-[660px] [--duration:46s] lg:flex" ariaLabel="Candidate and reviewer perspectives column four">
          {[...perspectives].reverse().map((item, index) => (
            <PerspectiveCard key={`four-${index}`} {...item} />
          ))}
        </Marquee>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white via-white/90 to-transparent dark:from-[#091221] dark:via-[#091221]/90" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#091221] dark:via-[#091221]/90" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-[#091221] dark:via-[#091221]/85 sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white/85 to-transparent dark:from-[#091221] dark:via-[#091221]/85 sm:w-32" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(59,130,246,0.08),transparent_48%)] dark:bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,0.08),transparent_48%)]" />
    </div>
  );
}
