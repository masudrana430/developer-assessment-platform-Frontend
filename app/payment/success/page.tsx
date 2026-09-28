import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/payments/payment-success";

export const metadata: Metadata = {
  title: "Payment Success",
  description: "Stripe Checkout success verification for a paid DevAssess attempt.",
};

export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
      <PaymentSuccess />
    </main>
  );
}
