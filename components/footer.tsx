"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  CircleHelp,
  CreditCard,
  Layers3,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type FooterLink = {
  heading: string;
  subheading: string;
  href: string;
  eyebrow: string;
  Icon: LucideIcon;
  gradient: string;
};

const links: FooterLink[] = [
  {
    heading: "About",
    subheading: "See how DevAssess connects the full assessment journey.",
    href: "/about",
    eyebrow: "Platform story",
    Icon: Sparkles,
    gradient: "from-blue-500/80 via-cyan-400/70 to-sky-300/60",
  },
  {
    heading: "Assessments",
    subheading: "Browse published assessments and start the candidate flow.",
    href: "/assessments",
    eyebrow: "Candidate journey",
    Icon: BadgeCheck,
    gradient: "from-indigo-500/80 via-blue-500/70 to-cyan-400/60",
  },
  {
    heading: "Features",
    subheading: "Explore timed attempts, grading, roles and platform controls.",
    href: "/features",
    eyebrow: "Core capabilities",
    Icon: Layers3,
    gradient: "from-violet-500/75 via-blue-500/70 to-cyan-400/60",
  },
  {
    heading: "Pricing",
    subheading: "Review assessment pricing and secure Stripe payment flows.",
    href: "/pricing",
    eyebrow: "Payments",
    Icon: CreditCard,
    gradient: "from-cyan-500/75 via-sky-500/70 to-blue-500/60",
  },
  {
    heading: "FAQ",
    subheading: "Find quick answers about access, attempts, reviews and payments.",
    href: "/faq",
    eyebrow: "Help center",
    Icon: CircleHelp,
    gradient: "from-sky-500/75 via-blue-500/70 to-indigo-500/60",
  },
];

function HoverFooterLink({ heading, subheading, href, eyebrow, Icon, gradient }: FooterLink) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pointer, setPointer] = useState({ x: 66, y: 50 });

  function handleMouseMove(e: ReactMouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPointer({
      x: Math.max(18, Math.min(82, x)),
      y: Math.max(20, Math.min(80, y)),
    });
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex min-h-28 items-center justify-between overflow-hidden border-b border-white/15 py-6 transition-colors duration-500 hover:border-cyan-100/70 md:min-h-36 md:py-8"
    >
      <div className="relative z-20 pr-20 sm:pr-28">
        <span className="block text-3xl font-bold tracking-tight text-slate-500 transition-colors duration-500 group-hover:text-white sm:text-4xl md:text-5xl lg:text-6xl">
          {heading.split("").map((letter, index) => (
            <span
              key={`${heading}-${index}`}
              className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
              style={{ transitionDelay: `${index * 28}ms` }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>
        <span className="mt-2 block max-w-xl text-sm leading-6 text-slate-500 transition-colors duration-500 group-hover:text-slate-200 sm:text-base">
          {subheading}
        </span>
      </div>

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute z-10 hidden h-28 w-40 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-gradient-to-br p-4 shadow-2xl shadow-black/30 backdrop-blur-xl transition-[transform,opacity,left,top] duration-300 ease-out sm:block md:h-36 md:w-52",
          gradient,
          hovered ? "scale-100 rotate-6 opacity-100" : "scale-0 -rotate-12 opacity-0",
        ].join(" ")}
        style={{ left: `${pointer.x}%`, top: `${pointer.y}%` }}
      >
        <div className="flex h-full flex-col justify-between rounded-xl border border-white/20 bg-slate-950/20 p-3 text-white backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">{eyebrow}</span>
            <Icon size={18} />
          </div>
          <div>
            <p className="text-lg font-bold md:text-xl">{heading}</p>
            <div className="mt-2 h-1 w-16 rounded-full bg-white/80" />
          </div>
        </div>
      </div>

      <div className="relative z-20 flex h-12 w-12 shrink-0 translate-x-4 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:h-14 sm:w-14">
        <ArrowRight size={24} />
      </div>
    </Link>
  );
}

function HomeFooter() {
  return (
    <footer className="mt-4 bg-[#050B16] px-4 pb-8 pt-14 text-white sm:px-6 sm:pt-16 md:pb-10 md:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 border-b border-white/15 pb-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100/15 bg-white/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
              <BookOpenText size={14} />
              Explore DevAssess
            </div>
            <h2 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Everything you need to move through the platform.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-400 md:text-right">
            Navigate the assessment workflow, understand the platform, or jump directly into the candidate experience.
          </p>
        </div>

        <div>
          {links.map((item) => (
            <HoverFooterLink key={item.href} {...item} />
          ))}
        </div>

        <div className="flex flex-col gap-5 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-xs font-bold text-white">DA</span>
            <div>
              <p className="font-semibold text-slate-200">DevAssess</p>
              <p className="text-xs text-slate-500">Developer Assessment Platform</p>
            </div>
          </div>
          <p>Secure assessments · Structured evaluation · Role-based workflows</p>
        </div>
      </div>
    </footer>
  );
}

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/") {
    return <HomeFooter />;
  }

  return (
    <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
      DevAssess · Developer Assessment Platform
    </footer>
  );
}
