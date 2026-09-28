import type { Metadata } from "next";
import { PaymentHistory } from "@/components/candidate/payment-history";

export const metadata: Metadata = {
  title: "Payment History",
  description: "Review real payment records linked to your assessment attempts.",
};

export default function CandidatePaymentsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Candidate billing</p>
      <h1 className="mt-1 text-3xl font-bold">Payment history</h1>
      <p className="mt-2 text-[var(--muted)]">These records come directly from your backend assessment attempts.</p>
      <PaymentHistory />
    </main>
  );
}
