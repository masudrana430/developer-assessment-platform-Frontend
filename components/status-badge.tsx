import { Badge } from "@/components/ui/badge";
import type { AttemptStatus, PaymentStatus } from "@/types";

const toneByStatus: Record<AttemptStatus | PaymentStatus, "neutral" | "blue" | "green" | "amber" | "red"> = {
  PENDING_PAYMENT: "amber",
  READY: "blue",
  IN_PROGRESS: "blue",
  SUBMITTED: "amber",
  UNDER_REVIEW: "amber",
  EVALUATED: "green",
  CANCELLED: "red",
  PENDING: "amber",
  REQUIRES_ACTION: "amber",
  SUCCEEDED: "green",
  FAILED: "red",
};

export function StatusBadge({ status }: { status: AttemptStatus | PaymentStatus }) {
  return <Badge tone={toneByStatus[status]}>{status.replaceAll("_", " ")}</Badge>;
}
