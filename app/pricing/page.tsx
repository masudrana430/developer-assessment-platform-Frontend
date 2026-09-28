import type { Metadata } from "next";
import Link from "next/link";
import { CircleDollarSign, CreditCard, ReceiptText } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Understand how free and paid assessments work in DevAssess.",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Assessment pricing</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Pricing is defined per assessment.</h1>
      <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">
        DevAssess does not invent subscription tiers. Reviewers configure each assessment with either a zero fee or a real Stripe test-mode fee stored by the backend.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Card>
          <CircleDollarSign className="text-[var(--primary)]" />
          <h2 className="mt-4 text-lg font-bold">Free assessments</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            A zero-fee assessment moves an enrolled candidate directly to the READY state.
          </p>
        </Card>
        <Card>
          <CreditCard className="text-[var(--primary)]" />
          <h2 className="mt-4 text-lg font-bold">Paid assessments</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Paid enrollment opens Stripe Checkout. The backend unlocks the attempt only after payment succeeds.
          </p>
        </Card>
        <Card>
          <ReceiptText className="text-[var(--primary)]" />
          <h2 className="mt-4 text-lg font-bold">Payment history</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Candidates can review payment status alongside their assessment history.
          </p>
        </Card>
      </div>

      <Link href="/assessments" className="mt-8 inline-flex rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white">
        Browse live assessment prices
      </Link>
    </main>
  );
}
