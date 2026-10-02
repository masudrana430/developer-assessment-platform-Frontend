"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowUpRight,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";
import useSmallDevice from "@/hooks/use-small-device";

const DesktopGravityContact = dynamic(
  () => import("@/components/home/gravity-contact"),
  { ssr: false },
);

const topics = [
  ["support", "bg-blue-600 text-white"],
  ["feedback", "bg-cyan-400 text-slate-950"],
  ["assessment setup", "bg-slate-950 text-white dark:bg-white dark:text-slate-950"],
  ["reviewer workflow", "bg-indigo-600 text-white"],
  ["partnerships", "bg-sky-500 text-white"],
  ["say hello 👋", "bg-violet-600 text-white"],
] as const;

export default function GravityContactResponsive() {
  const small = useSmallDevice();

  if (small === false) {
    return <DesktopGravityContact />;
  }

  return (
    <section id="contact" className="px-4 pb-4">
      <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-sm dark:bg-[#071426]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.08),transparent_28%)]" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
            <MessageCircleMore size={14} />
            Contact
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight">
            Have something in mind? Let&apos;s talk.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Questions about assessments, reviewer workflows, platform setup or feedback?
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/faq"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white"
            >
              Get help <ArrowUpRight size={17} />
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm font-semibold"
            >
              About DevAssess
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {topics.map(([label, className], index) => (
              <span
                key={label}
                className={["rounded-full px-3.5 py-2 text-xs font-bold shadow-sm", className].join(" ")}
              >
                <span className="inline-flex items-center gap-1.5">
                  {index === topics.length - 1 ? <Sparkles size={14} /> : null}
                  {label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
