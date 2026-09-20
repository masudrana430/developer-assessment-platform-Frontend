import Link from "next/link";
import { ArrowRight, ShieldCheck, CreditCard, ClipboardCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="max-w-3xl">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            Developer Assessment Platform
          </span>
          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-950">
            Assess developers with structured tests, secure payments and reviewer workflows.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A base Next.js frontend connected to your existing Node/Express backend on Render.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/assessments" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              Browse Assessments <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50">
              Login
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          <Card>
            <ShieldCheck className="text-blue-600" />
            <h3 className="mt-4 font-semibold">Role-based access</h3>
            <p className="mt-2 text-sm text-slate-600">Candidate, Reviewer and Admin workflows.</p>
          </Card>
          <Card>
            <CreditCard className="text-blue-600" />
            <h3 className="mt-4 font-semibold">Stripe Checkout</h3>
            <p className="mt-2 text-sm text-slate-600">Ready to connect to your hosted Checkout Session endpoint.</p>
          </Card>
          <Card>
            <ClipboardCheck className="text-blue-600" />
            <h3 className="mt-4 font-semibold">Assessment workflow</h3>
            <p className="mt-2 text-sm text-slate-600">Enroll, attempt, submit, review and evaluate.</p>
          </Card>
        </div>
      </section>
    </main>
  );
}
