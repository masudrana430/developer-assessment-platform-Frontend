"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  MessageCircleMore,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import Gravity, { MatterBody } from "@/components/fancy/physics/gravity";

const topics = [
  {
    label: "support",
    x: "18%",
    y: "12%",
    angle: -7,
    className: "bg-blue-600 text-white",
  },
  {
    label: "feedback",
    x: "34%",
    y: "30%",
    angle: 6,
    className: "bg-cyan-400 text-slate-950",
  },
  {
    label: "assessment setup",
    x: "48%",
    y: "16%",
    angle: -3,
    className: "bg-slate-950 text-white dark:bg-white dark:text-slate-950",
  },
  {
    label: "reviewer workflow",
    x: "67%",
    y: "28%",
    angle: 9,
    className: "bg-indigo-600 text-white",
  },
  {
    label: "partnerships",
    x: "80%",
    y: "12%",
    angle: -5,
    className: "bg-sky-500 text-white",
  },
  {
    label: "say hello 👋",
    x: "55%",
    y: "8%",
    angle: 4,
    className: "bg-violet-600 text-white",
  },
];

export default function GravityContact() {
  return (
    <section id="contact" className="px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="relative mx-auto min-h-[760px] max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-[0_24px_80px_rgba(37,99,235,0.08)] dark:bg-[#071426] dark:shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:min-h-[800px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.10),transparent_26%)] dark:bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.12),transparent_26%)]" />

        <div className="relative z-20 mx-auto max-w-4xl px-6 pt-12 text-center sm:px-10 sm:pt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)] shadow-sm backdrop-blur-xl">
            <MessageCircleMore size={14} />
            Contact
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Have something in mind? Let&apos;s talk.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Questions about assessments, reviewer workflows, platform setup or feedback?
            Choose a starting point, then drag the topics below and watch them react.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/faq"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]"
            >
              Get help <ArrowUpRight size={17} />
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)]/85 px-5 py-3 text-sm font-semibold backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[var(--muted-bg)]"
            >
              About DevAssess
            </Link>
          </div>

          <p className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            <MousePointer2 size={14} />
            Drag the contact topics
          </p>
        </div>

        <div className="absolute inset-x-4 bottom-4 top-[330px] overflow-hidden rounded-[1.5rem] border border-dashed border-blue-200/70 bg-blue-50/35 dark:border-white/10 dark:bg-white/[0.025] sm:inset-x-6 sm:bottom-6 sm:top-[320px]">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-t from-blue-100/45 to-transparent dark:from-blue-950/20" />

          <Gravity
            gravity={{ x: 0, y: 1 }}
            resetOnResize={false}
            className="z-10"
          >
            {topics.map((topic, index) => (
              <MatterBody
                key={topic.label}
                matterBodyOptions={{
                  friction: 0.5,
                  frictionAir: 0.015,
                  restitution: 0.42,
                  density: 0.001,
                }}
                x={topic.x}
                y={topic.y}
                angle={topic.angle}
              >
                <div
                  className={[
                    "select-none whitespace-nowrap rounded-full px-5 py-3 text-base font-bold shadow-xl shadow-slate-950/10 sm:px-7 sm:py-4 sm:text-xl md:text-2xl",
                    topic.className,
                  ].join(" ")}
                >
                  <span className="inline-flex items-center gap-2">
                    {index === topics.length - 1 ? <Sparkles size={18} /> : null}
                    {topic.label}
                  </span>
                </div>
              </MatterBody>
            ))}
          </Gravity>
        </div>
      </div>
    </section>
  );
}
