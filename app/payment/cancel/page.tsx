import type { Metadata } from "next";
import { PaymentCancel } from "@/components/payments/payment-cancel";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  description: "Return safely to a DevAssess attempt after cancelling Stripe Checkout.",
};

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
      <PaymentCancel />
    </main>
  );
}
