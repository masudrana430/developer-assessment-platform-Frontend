import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  detail?: string;
}) {
  return (
    <Card>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--muted-bg)] text-[var(--primary)]">
        <Icon size={19} />
      </span>
      <p className="mt-4 text-sm font-semibold text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
      {detail ? <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{detail}</p> : null}
    </Card>
  );
}
