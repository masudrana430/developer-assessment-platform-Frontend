"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, UsersRound } from "lucide-react";
import useSmallDevice from "@/hooks/use-small-device";

const DesktopCommunityScene = dynamic(
  () => import("@/components/community/community-scene"),
  { ssr: false },
);

export default function CommunitySceneResponsive() {
  const small = useSmallDevice();

  if (small === false) {
    return <DesktopCommunityScene />;
  }

  return (
    <main className="relative min-h-[calc(100vh-65px)] overflow-hidden bg-white dark:bg-[#07111f]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_42%,rgba(37,99,235,0.13),transparent_34%),radial-gradient(circle_at_78%_34%,rgba(34,211,238,0.10),transparent_30%)] dark:bg-[radial-gradient(circle_at_28%_42%,rgba(59,130,246,0.17),transparent_34%),radial-gradient(circle_at_78%_34%,rgba(34,211,238,0.10),transparent_30%)]" />

      <div className="pointer-events-none absolute left-[-3rem] top-24 h-36 w-36 rounded-full border border-blue-200/60 bg-blue-100/45 blur-[1px] dark:border-white/10 dark:bg-blue-500/10" />
      <div className="pointer-events-none absolute -right-10 bottom-16 h-44 w-44 rounded-full border border-cyan-200/50 bg-cyan-100/35 blur-[1px] dark:border-white/10 dark:bg-cyan-400/10" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-start justify-center px-4 pb-12 pt-10">
        <div className="w-full rounded-[2rem] border border-white/55 bg-white/[0.42] p-6 shadow-[0_18px_60px_rgba(37,99,235,0.10)] ring-1 ring-white/35 backdrop-blur-2xl dark:border-white/12 dark:bg-slate-950/[0.34] dark:ring-white/10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/85 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-700 dark:border-cyan-100/15 dark:bg-white/[0.07] dark:text-cyan-100">
            <UsersRound size={14} />
            DevAssess Community
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
            Join the{" "}
            <span className="italic text-blue-600 dark:text-cyan-200">
              community
            </span>
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
            Connect with candidates, reviewers and builders exploring better
            developer assessment workflows.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/register"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
            >
              Join the community <ArrowRight size={17} />
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-white/55 px-5 py-3 text-sm font-semibold text-slate-800 backdrop-blur dark:bg-white/[0.06] dark:text-white"
            >
              Learn about DevAssess
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2" aria-hidden="true">
            {["Candidate", "Reviewer", "Admin"].map((role) => (
              <div
                key={role}
                className="rounded-2xl border border-white/50 bg-white/35 px-3 py-4 text-center backdrop-blur dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-blue-500 dark:bg-cyan-200" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
