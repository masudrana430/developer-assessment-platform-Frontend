"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileClock, Shield } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryState } from "@/hooks/use-query-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import type { ApiResponse, AuditLog } from "@/types";

export function AdminAudit() {
  const { searchParams, setQuery } = useQueryState();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const entityType = searchParams.get("entityType") ?? "";
  const [action, setAction] = useState(searchParams.get("action") ?? "");
  const [entity, setEntity] = useState(entityType);
  const debouncedAction = useDebounce(action);
  const debouncedEntity = useDebounce(entity);

  useEffect(() => {
    const currentAction = searchParams.get("action") ?? "";
    const currentEntity = searchParams.get("entityType") ?? "";
    if (currentAction !== debouncedAction || currentEntity !== debouncedEntity) {
      setQuery({ action: debouncedAction || null, entityType: debouncedEntity || null }, true);
    }
  }, [debouncedAction, debouncedEntity, searchParams, setQuery]);

  const query = useQuery({
    queryKey: ["admin-audit", page, debouncedAction, debouncedEntity],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (debouncedAction) params.set("action", debouncedAction);
      if (debouncedEntity) params.set("entityType", debouncedEntity);
      return apiRequest<ApiResponse<AuditLog[]>>(`/admin/audit-logs?${params.toString()}`, { auth: true });
    },
  });

  return (
    <>
      <div className="mt-6 grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:grid-cols-2">
        <SearchInput value={action} onChange={setAction} placeholder="Filter by action" />
        <SearchInput value={entity} onChange={setEntity} placeholder="Filter by entity type" />
      </div>

      <div className="mt-5 grid gap-3">
        {query.data?.data.map((log) => (
          <Card key={log.id} className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Shield size={16} className="text-[var(--primary)]" />
                <p className="font-semibold">{log.action}</p>
                <Badge>{log.entityType}</Badge>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">{log.actor ? `${log.actor.name} · ${log.actor.email} · ${log.actor.role}` : "System"} · {new Date(log.createdAt).toLocaleString()}</p>
            </div>
            {log.entityId ? <code className="text-xs text-[var(--muted)]">{log.entityId.slice(0, 12)}…</code> : null}
          </Card>
        ))}
      </div>

      {!query.isLoading && query.data?.data.length === 0 ? (
        <div className="mt-6"><EmptyState icon={FileClock} title="No audit events found" description="Change the URL filters to inspect a different set of backend audit events." /></div>
      ) : null}

      {query.data?.meta && query.data.meta.totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
          <button className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-40" disabled={page <= 1} onClick={() => setQuery({ page: page - 1 })}>Previous</button>
          <span className="text-sm text-[var(--muted)]">Page {query.data.meta.page} of {query.data.meta.totalPages}</span>
          <button className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-40" disabled={page >= query.data.meta.totalPages} onClick={() => setQuery({ page: page + 1 })}>Next</button>
        </div>
      ) : null}
    </>
  );
}
