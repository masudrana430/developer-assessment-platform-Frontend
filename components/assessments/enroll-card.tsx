"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import type { ApiResponse, Assessment, Attempt } from "@/types";

export function EnrollCard({ assessment }: { assessment: Assessment }) {
  const { user } = useAuth();
  const router = useRouter();

  const enroll = useMutation({
    mutationFn: () =>
      apiRequest<ApiResponse<Attempt>>(`/attempts/enroll/${assessment.id}`, {
        method: "POST",
        auth: true,
      }),
    onSuccess: async (result) => {
      if (result.data.status === "PENDING_PAYMENT") {
        const checkout = await apiRequest<ApiResponse<{ checkoutUrl: string | null }>>(
          `/payments/attempts/${result.data.id}/checkout`,
          { method: "POST", auth: true },
        );

        if (checkout.data.checkoutUrl) {
          sessionStorage.setItem("dap_checkout_attempt", result.data.id);
          window.location.assign(checkout.data.checkoutUrl);
          return;
        }
      }

      toast.success("Enrollment created");
      router.push(`/attempts/${result.data.id}`);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Enrollment failed"),
  });

  return (
    <Card className="h-fit">
      <p className="text-sm text-[var(--muted)]">Passing score</p>
      <p className="mt-1 text-3xl font-bold">{assessment.passingScore}%</p>
      <div className="mt-5">
        {!user ? (
          <Link href={`/login?next=/assessments/${assessment.id}`} className="inline-flex w-full justify-center rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white">
            Sign in to enroll
          </Link>
        ) : user.role !== "CANDIDATE" ? (
          <p className="rounded-xl bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            Only Candidate accounts can enroll.
          </p>
        ) : (
          <Button className="w-full" disabled={enroll.isPending} onClick={() => enroll.mutate()}>
            {enroll.isPending ? "Preparing..." : assessment.feeCents > 0 ? "Enroll & pay" : "Enroll for free"}
          </Button>
        )}
      </div>
      {user?.role === "CANDIDATE" ? (
        <Link href="/attempts" className="mt-3 block text-center text-sm font-semibold text-[var(--primary)]">
          View my attempts
        </Link>
      ) : null}
    </Card>
  );
}
