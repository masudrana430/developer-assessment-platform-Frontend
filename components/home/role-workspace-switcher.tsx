"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import useSmallDevice from "@/hooks/use-small-device";
import {
  BarChart3,
  BadgeCheck,
  ClipboardList,
  FileClock,
  ShieldCheck,
  TimerReset,
  UserCog,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

const TargetCursor = dynamic(
  () => import("@/components/reactbits/target-cursor/TargetCursor"),
  { ssr: false },
);

type RoleKey = "candidate" | "reviewer" | "admin";

type RoleConfig = {
  label: string;
  eyebrow: string;
  description: string;
  Icon: LucideIcon;
  steps: Array<{ label: string; detail: string; Icon: LucideIcon }>;
};

const roles: Record<RoleKey, RoleConfig> = {
  candidate: {
    label: "Candidate",
    eyebrow: "Take assessments",
    description:
      "Discover published assessments, complete payment when required, work through timed questions and follow the attempt through evaluation.",
    Icon: UsersRound,
    steps: [
      { label: "Browse & enroll", detail: "Published assessment discovery", Icon: ClipboardList },
      { label: "Timed attempt", detail: "Save MCQ, text and code answers", Icon: TimerReset },
      { label: "Result", detail: "Score, decision and feedback", Icon: BadgeCheck },
    ],
  },
  reviewer: {
    label: "Reviewer",
    eyebrow: "Evaluate submissions",
    description:
      "Manage assessment content, claim submitted attempts and score subjective TEXT and CODE responses with feedback.",
    Icon: BadgeCheck,
    steps: [
      { label: "Assessment workspace", detail: "Questions and publishing flow", Icon: ClipboardList },
      { label: "Claim review", detail: "Atomic assignment workflow", Icon: ShieldCheck },
      { label: "Grade & feedback", detail: "Structured subjective scoring", Icon: BadgeCheck },
    ],
  },
  admin: {
    label: "Admin",
    eyebrow: "Supervise the platform",
    description:
      "Inspect platform statistics, manage users and roles, and review audit activity from the administration workspace.",
    Icon: ShieldCheck,
    steps: [
      { label: "Platform overview", detail: "Operational statistics", Icon: BarChart3 },
      { label: "User controls", detail: "Roles, statuses and account actions", Icon: UserCog },
      { label: "Audit logs", detail: "Security-sensitive activity", Icon: FileClock },
    ],
  },
};

export default function RoleWorkspaceSwitcher() {
  const [active, setActive] = useState<RoleKey>("candidate");
  const small = useSmallDevice();
  const config = roles[active];
  const ActiveIcon = config.Icon;

  return (
    <section
      id="role-workspaces-target-cursor"
      className="px-4 py-16 sm:px-6 sm:py-20"
    >
      {small === false ? (
        <TargetCursor
          targetSelector=".role-workspace-cursor-target"
          scopeSelector="#role-workspaces-target-cursor"
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
          hoverDuration={0.2}
          cursorColor="#ffffff"
          cursorColorOnTarget="#B497CF"
        />
      ) : null}
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
          <div className="flex flex-col justify-between rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
                Role workspaces
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                One platform. Three focused experiences.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
                Switch roles to see how DevAssess changes the workflow around each user.
              </p>
            </div>

            <div className="mt-8 grid gap-2">
              {(Object.keys(roles) as RoleKey[]).map((key) => {
                const item = roles[key];
                const Icon = item.Icon;
                const selected = key === active;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActive(key)}
                    className={[
                      "role-workspace-cursor-target flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition duration-300 hover:-translate-y-0.5",
                      selected
                        ? "border-blue-500/40 bg-blue-500/10 shadow-sm"
                        : "border-[var(--border)] hover:bg-[var(--muted-bg)]",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={[
                          "grid h-10 w-10 place-items-center rounded-xl",
                          selected
                            ? "bg-blue-600 text-white"
                            : "bg-[var(--muted-bg)] text-[var(--muted)]",
                        ].join(" ")}
                      >
                        <Icon size={18} />
                      </span>
                      <span>
                        <span className="block font-bold">{item.label}</span>
                        <span className="mt-0.5 block text-xs text-[var(--muted)]">
                          {item.eyebrow}
                        </span>
                      </span>
                    </span>
                    <span className="text-sm text-[var(--muted)]">→</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#071426] p-6 text-white shadow-2xl shadow-blue-950/15 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_10%_90%,rgba(37,99,235,0.20),transparent_30%)]" />

            <div className="relative">
              <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                    {config.eyebrow}
                  </p>
                  <h3 className="mt-2 text-3xl font-bold">{config.label} workspace</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                    {config.description}
                  </p>
                </div>
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-cyan-100">
                  <ActiveIcon size={24} />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {config.steps.map(({ label, detail, Icon }, index) => (
                  <div
                    key={label}
                    className="role-workspace-cursor-target group rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-100/25 hover:bg-white/[0.10]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-cyan-100">
                        <Icon size={18} />
                      </div>
                      <span className="text-xs font-bold text-slate-500">0{index + 1}</span>
                    </div>
                    <p className="mt-5 font-bold">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
                  </div>
                ))}
              </div>

              <div className="role-workspace-cursor-target mt-6 rounded-2xl border border-white/10 bg-slate-950/30 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-slate-950/40">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  <span>Role-aware experience</span>
                  <span className="text-emerald-300">Active</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 via-cyan-300 to-emerald-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
