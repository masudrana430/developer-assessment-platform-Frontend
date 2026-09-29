import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, TimerReset, UsersRound, ShieldCheck, BarChart3, Sparkles } from "lucide-react";
import ThemeFibreArc from "@/components/home/theme-fibre-arc";
import { Card } from "@/components/ui/card";

const features = [
  { icon: TimerReset, title: "Timed assessments", text: "Candidates start secure, timed attempts with auto-saved answers." },
  { icon: CreditCard, title: "Stripe Checkout", text: "Paid assessments use a real Stripe-hosted checkout workflow." },
  { icon: UsersRound, title: "Three clear roles", text: "Purpose-built experiences for Candidates, Reviewers and Admins." },
  { icon: BadgeCheck, title: "Structured grading", text: "MCQs are auto-scored while reviewers grade subjective responses." },
  { icon: ShieldCheck, title: "Protected workflows", text: "Role checks, state transitions and audit trails are enforced by the API." },
  { icon: BarChart3, title: "Operational visibility", text: "Admin statistics and audit logs make the platform easy to supervise." },
];

const workflow = [
  "Choose a published assessment",
  "Enroll and complete Stripe payment",
  "Start the timed attempt",
  "Submit answers for review",
  "Receive score, decision and feedback",
];

export default function HomePage() {
  return (
    <main>
      <section className="px-4 pt-6 sm:px-6 sm:pt-10">
        <div className="relative mx-auto min-h-[680px] max-w-7xl overflow-hidden rounded-[2rem] border border-white/80 bg-[#EEF6FF] text-slate-950 shadow-2xl shadow-blue-200/45 transition-colors duration-300 dark:border-white/15 dark:bg-[#071426] dark:text-white dark:shadow-blue-950/25 sm:min-h-[720px]">
          <div className="absolute inset-0">
            <ThemeFibreArc />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/35 via-white/10 to-transparent dark:from-[#06101F]/80 dark:via-[#06101F]/42" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/15 via-transparent to-white/5 dark:from-[#06101F]/45 dark:to-white/[0.02]" />
          <div className="pointer-events-none absolute -right-28 top-8 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-300/10" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl dark:bg-blue-500/10" />

          <div className="relative z-10 grid min-h-[680px] items-center gap-12 px-6 py-14 sm:min-h-[720px] sm:px-10 lg:grid-cols-[1.02fr_.98fr] lg:px-14 xl:px-16">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/55 px-3.5 py-1.5 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-200/30 backdrop-blur-xl dark:border-white/20 dark:bg-white/[0.12] dark:text-cyan-100 dark:shadow-blue-950/10"><Sparkles size={14} className="text-cyan-600 dark:text-cyan-200" />
                Developer Assessment Platform
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                Assess developer skills with a simple end-to-end workflow.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-200 sm:text-lg">
                Browse assessments, pay securely, complete timed attempts, receive reviewer feedback and manage the platform from one responsive interface.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/assessments"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-300/30 transition hover:-translate-y-0.5 hover:bg-blue-950 dark:bg-white dark:text-slate-950 dark:shadow-blue-950/20 dark:hover:bg-cyan-50"
                >
                  Browse assessments <ArrowRight size={18} />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/90 bg-white/55 px-5 py-3 font-semibold text-slate-800 shadow-lg shadow-blue-200/25 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/75 dark:border-white/25 dark:bg-white/[0.12] dark:text-white dark:shadow-blue-950/10 dark:hover:bg-white/[0.18]"
                >
                  Create candidate account
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600 dark:text-slate-200">
                <span className="inline-flex items-center gap-2"><BadgeCheck size={16} className="text-blue-600 dark:text-blue-300" /> Real assessments</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-blue-600 dark:text-blue-300" /> Role-protected flows</span>
                <span className="inline-flex items-center gap-2"><CreditCard size={16} className="text-blue-600 dark:text-blue-300" /> Stripe checkout</span>
              </div>
            </div>

            <div className="w-full max-w-lg space-y-4 lg:justify-self-end">
              <div className="relative overflow-hidden rounded-3xl border border-white/90 bg-white/55 p-6 shadow-2xl shadow-blue-200/35 backdrop-blur-2xl dark:border-white/20 dark:bg-white/[0.11] dark:shadow-black/20 sm:p-7">
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent dark:via-cyan-100/80" />
                <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-cyan-400/15 blur-2xl dark:bg-cyan-300/10" />
                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-blue-700 dark:text-cyan-100">Assessment workflow</p>
                    <h2 className="mt-1 text-xl font-bold">From enrollment to feedback</h2>
                  </div>
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/90 bg-white/60 shadow-inner dark:border-white/15 dark:bg-white/[0.12]">
                    <TimerReset size={20} className="text-blue-700 dark:text-cyan-100" />
                  </div>
                </div>

                <div className="relative mt-6 space-y-3">
                  {workflow.map((step, index) => (
                    <div key={step} className="group flex gap-4 rounded-2xl border border-white/90 bg-white/45 p-3.5 shadow-sm backdrop-blur-md transition hover:border-blue-200/80 hover:bg-white/70 dark:border-white/10 dark:bg-slate-950/20 dark:hover:border-white/20 dark:hover:bg-white/[0.08]">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-700 ring-1 ring-blue-400/20 dark:bg-cyan-300/10 dark:text-cyan-100 dark:ring-cyan-200/20">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-50">{step}</p>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-blue-950/10 dark:bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 dark:from-blue-400 dark:via-cyan-300 dark:to-cyan-100"
                            style={{ width: `${(index + 1) * 20}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/90 bg-white/55 p-5 shadow-xl shadow-blue-200/30 backdrop-blur-2xl dark:border-white/20 dark:bg-white/[0.10] dark:shadow-black/15">
                <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent dark:via-white/70" />
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700/80 dark:text-cyan-100/80">Role-ready workspace</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-200">One platform, three focused experiences.</p>
                  </div>
                  <UsersRound size={20} className="shrink-0 text-blue-700 dark:text-cyan-100" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {["Candidate", "Reviewer", "Admin"].map((role) => (
                    <div key={role} className="rounded-2xl border border-white/90 bg-white/45 px-3 py-3 text-center backdrop-blur-md dark:border-white/10 dark:bg-slate-950/20">
                      <div className="mx-auto mb-2 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.45)] dark:bg-cyan-200 dark:shadow-[0_0_14px_rgba(165,243,252,0.9)]" />
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 sm:text-sm">{role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <Icon className="text-[var(--primary)]" size={22} />
              <h2 className="mt-4 text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
