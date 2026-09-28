"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import type { ApiResponse, Attempt } from "@/types";

export function PaymentSuccess() {
  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    setAttemptId(sessionStorage.getItem("dap_checkout_attempt"));
  }, []);

  const query = useQuery({
    queryKey: ["payment-return-attempt", attemptId],
    enabled: Boolean(attemptId),
    queryFn: () => apiRequest<ApiResponse<Attempt>>(`/attempts/${attemptId}`, { auth: true }),
    refetchInterval: 2500,
  });

  const attempt = query.data?.data;
  const ready = attempt?.payment?.status === "SUCCEEDED" && attempt.status !== "PENDING_PAYMENT";

  useEffect(() => {
    if (ready) sessionStorage.removeItem("dap_checkout_attempt");
  }, [ready]);

  return (
    <Card className="w-full max-w-xl p-6 text-center sm:p-8">
      {ready ? (
        <CheckCircle2 className="mx-auto text-emerald-500" size={44} />
      ) : (
        <LoaderCircle className="mx-auto animate-spin text-[var(--primary)]" size={40} />
      )}
      <h1 className="mt-5 text-2xl font-bold">{ready ? "Payment confirmed" : "Payment received — verifying"}</h1>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        {ready
          ? "Stripe and the backend webhook have confirmed your payment. The assessment attempt is ready."
          : "Stripe returned successfully. DevAssess is waiting for the signed webhook to update the attempt."}
      </p>

      {attempt?.payment ? (
        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="text-sm text-[var(--muted)]">Payment status</span>
          <StatusBadge status={attempt.payment.status} />
        </div>
      ) : null}

      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        {attemptId ? <Link href={`/attempts/${attemptId}`} className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white">Open attempt</Link> : null}
        <Link href="/attempts" className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold">My attempts</Link>
      </div>
    </Card>
  );
}
