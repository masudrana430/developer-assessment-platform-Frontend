import type { Metadata } from "next";
import Link from "next/link";
import {
  CircleDollarSign,
  CreditCard,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { GlareHover } from "@/components/magicui/glare-hover";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Understand how free and paid assessments work in DevAssess.",
};

type PricingCard = {
  eyebrow: string;
  title: string;
  description: string;
  footer: string;
  Icon: LucideIcon;
};

const pricingCards: PricingCard[] = [
  {
    eyebrow: "No payment required",
    title: "Free assessments",
    description:
      "A zero-fee assessment moves an enrolled candidate directly to the READY state.",
    footer: "Direct enrollment flow",
    Icon: CircleDollarSign,
  },
  {
    eyebrow: "Stripe test-mode checkout",
    title: "Paid assessments",
    description:
      "Paid enrollment opens Stripe Checkout. The backend unlocks the attempt only after payment succeeds.",
    footer: "Webhook-confirmed access",
    Icon: CreditCard,
  },
  {
    eyebrow: "Candidate payment visibility",
    title: "Payment history",
    description:
      "Candidates can review payment status alongside their assessment history.",
    footer: "Tracked with assessment history",
    Icon: ReceiptText,
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
          Assessment pricing
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Pricing is defined per assessment.
        </h1>
        <p className="mt-4 leading-7 text-[var(--muted)]">
          DevAssess does not invent subscription tiers. Reviewers configure each
          assessment with either a zero fee or a real Stripe test-mode fee
          stored by the backend.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {pricingCards.map(({ eyebrow, title, description, footer, Icon }) => (
          <GlareHover
            key={title}
            className="h-full w-full rounded-2xl"
            background="transparent"
            color="#505050"
            duration={700}
            opacity={0.55}
            size={260}
          >
            <Card className="flex h-full w-full flex-col overflow-hidden rounded-2xl p-0 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
              <div className="flex flex-1 flex-col items-center px-6 py-7">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--primary)] shadow-sm">
                  <Icon size={21} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  {eyebrow}
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight">
                  {title}
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
                  {description}
                </p>
              </div>

              <div className="border-t border-[var(--border)] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {footer}
                </p>
              </div>
            </Card>
          </GlareHover>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/assessments"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
        >
          Browse live assessment prices
        </Link>
      </div>
    </main>
  );
}
