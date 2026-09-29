import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, TimerReset, UsersRound, ShieldCheck, BarChart3 } from "lucide-react";
import FibreArc from "@/components/originkit/fibre-arc";
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
        <div className="relative mx-auto min-h-[640px] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#01030A] text-white shadow-2xl shadow-blue-950/20 sm:min-h-[680px]">
          <div className="absolute inset-0">
            <FibreArc
              style={{ minWidth: 0, minHeight: 0, width: "100%", height: "100%" }}
              background="#01030A"
              baseColor="#1B4FD8"
              accentColor="#6FC8FF"
              highlight="#FFFFFF"
              density={26}
              speed={72}
              hover={180}
              reach={30}
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#01030A] via-[#01030A]/85 to-[#01030A]/20" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#01030A] via-transparent to-[#01030A]/10" />

          <div className="relative z-10 grid min-h-[640px] items-center gap-12 px-6 py-14 sm:min-h-[680px] sm:px-10 lg:grid-cols-[1.08fr_.92fr] lg:px-14 xl:px-16">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-blue-200 backdrop-blur-md">
                Developer Assessment Platform
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                Assess developer skills with a simple end-to-end workflow.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Browse assessments, pay securely, complete timed attempts, receive reviewer feedback and manage the platform from one responsive interface.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/assessments"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-blue-50"
                >
                  Browse assessments <ArrowRight size={18} />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
                >
                  Create candidate account
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2"><BadgeCheck size={16} className="text-blue-300" /> Real assessments</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-blue-300" /> Role-protected flows</span>
                <span className="inline-flex items-center gap-2"><CreditCard size={16} className="text-blue-300" /> Stripe checkout</span>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/[0.08] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-blue-200">Assessment workflow</p>
                    <h2 className="mt-1 text-xl font-bold">From enrollment to feedback</h2>
                  </div>
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10">
                    <TimerReset size={20} className="text-blue-200" />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {workflow.map((step, index) => (
                    <div key={step} className="group flex gap-4 rounded-2xl border border-white/10 bg-black/10 p-3.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-400/15 text-sm font-bold text-blue-200 ring-1 ring-blue-300/20">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-100">{step}</p>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                            style={{ width: `${(index + 1) * 20}%` }}
                          />
                        </div>
                      </div>
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
