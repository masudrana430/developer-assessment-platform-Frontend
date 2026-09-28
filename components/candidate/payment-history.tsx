"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, ReceiptText } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiResponse, Attempt } from "@/types";

export function PaymentHistory() {
  const query = useQuery({
    queryKey: ["candidate-payments"],
    queryFn: () => apiRequest<ApiResponse<Attempt[]>>("/attempts/my?page=1&limit=100", { auth: true }),
  });

  const paidAttempts = (query.data?.data ?? []).filter((attempt) => attempt.payment);

  if (query.isLoading) {
    return <div className="mt-6 grid gap-3">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-24 w-full" />)}</div>;
  }

  if (query.error) {
    return <p className="mt-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-600">{query.error instanceof Error ? query.error.message : "Unable to load payments"}</p>;
  }

  if (paidAttempts.length === 0) {
    return <div className="mt-6"><EmptyState icon={ReceiptText} title="No payment history" description="Payments will appear here after you enroll in a paid assessment." /></div>;
  }

  return (
    <div className="mt-6 grid gap-3">
      {paidAttempts.map((attempt) => (
        <Card key={attempt.id} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--muted-bg)] text-[var(--primary)]"><CreditCard size={18} /></span>
            <div>
              <p className="font-bold">{attempt.assessment.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {attempt.payment ? `${(attempt.payment.amountCents / 100).toFixed(2)} ${attempt.payment.currency.toUpperCase()}` : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {attempt.payment ? <StatusBadge status={attempt.payment.status} /> : null}
            <Link href={`/attempts/${attempt.id}`} className="text-sm font-semibold text-[var(--primary)]">Attempt →</Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
