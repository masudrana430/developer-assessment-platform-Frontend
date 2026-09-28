"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function PaymentCancel() {
  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    setAttemptId(sessionStorage.getItem("dap_checkout_attempt"));
  }, []);

  return (
    <Card className="w-full max-w-xl p-6 text-center sm:p-8">
      <XCircle className="mx-auto text-amber-500" size={44} />
      <h1 className="mt-5 text-2xl font-bold">Payment cancelled</h1>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Stripe Checkout was closed before payment completed. No manual success state is created.
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        {attemptId ? <Link href={`/attempts/${attemptId}`} className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white">Return to payment</Link> : null}
        <Link href="/attempts" className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold">My attempts</Link>
      </div>
    </Card>
  );
}
