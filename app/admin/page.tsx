"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, ClipboardList, CreditCard, Search, Shield, UsersRound } from "lucide-react";
import { RequireAuth } from "@/components/guard";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminStats, ApiResponse, AuditLog, Role, User, UserStatus } from "@/types";

export default function AdminPage() {
  return <RequireAuth roles={["ADMIN"]}><AdminContent /></RequireAuth>;
}

function AdminContent() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [auditSearch, setAuditSearch] = useState("");

  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiRequest<ApiResponse<AdminStats>>("/admin/stats", { auth: true }),
  });

  const users = useQuery({
    queryKey: ["admin-users", search, role, status],
    queryFn: () => {
      const params = new URLSearchParams({ page: "1", limit: "100", sortOrder: "desc" });
      if (search.trim()) params.set("search", search.trim());
      if (role) params.set("role", role);
      if (status) params.set("status", status);
      return apiRequest<ApiResponse<User[]>>(`/admin/users?${params.toString()}`, { auth: true });
    },
  });

  const audit = useQuery({
    queryKey: ["admin-audit", auditSearch],
    queryFn: () => {
      const params = new URLSearchParams({ page: "1", limit: "50" });
      if (auditSearch.trim()) params.set("action", auditSearch.trim());
      return apiRequest<ApiResponse<AuditLog[]>>(`/admin/audit-logs?${params.toString()}`, { auth: true });
    },
  });

  const changeStatus = useMutation({
    mutationFn: ({ userId, next }: { userId: string; next: UserStatus }) =>
      apiRequest<ApiResponse<User>>(`/admin/users/${userId}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status: next }),
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const changeRole = useMutation({
    mutationFn: ({ userId, next }: { userId: string; next: Role }) =>
      apiRequest<ApiResponse<User>>(`/admin/users/${userId}/role`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ role: next }),
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const remove = useMutation({
    mutationFn: (userId: string) =>
      apiRequest<ApiResponse<null>>(`/admin/users/${userId}`, {
        method: "DELETE",
        auth: true,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const money = useMemo(() => {
    const amount = stats.data?.data.payments.grossAmountInMinorUnits ?? 0;
    return (amount / 100).toFixed(2);
  }, [stats.data]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div>
        <p className="text-sm font-semibold text-[var(--primary)]">Admin console</p>
        <h1 className="mt-1 text-3xl font-bold">Platform overview</h1>
        <p className="mt-2 text-[var(--muted)]">Manage accounts and inspect operational activity.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={UsersRound} label="Users" value={stats.data?.data.users.total ?? 0} detail={`${stats.data?.data.users.candidates ?? 0} candidates · ${stats.data?.data.users.reviewers ?? 0} reviewers`} />
        <Stat icon={ClipboardList} label="Published assessments" value={stats.data?.data.assessments.published ?? 0} detail="Available in public catalog" />
        <Stat icon={Activity} label="Attempts" value={stats.data?.data.attempts.total ?? 0} detail={`${stats.data?.data.attempts.evaluated ?? 0} evaluated`} />
        <Stat icon={CreditCard} label="Successful payments" value={stats.data?.data.payments.successfulCount ?? 0} detail={`${money} in minor-unit currency total`} />
      </div>

      <section className="mt-12">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div><h2 className="text-xl font-bold">Users</h2><p className="mt-1 text-sm text-[var(--muted)]">Search, block, promote or soft-delete accounts.</p></div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[650px]">
            <div className="relative"><Search className="absolute left-3 top-3 text-[var(--muted)]" size={16} /><Input className="pl-9" placeholder="Search user..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <Select value={role} onChange={(e) => setRole(e.target.value)}><option value="">All roles</option><option value="CANDIDATE">Candidate</option><option value="REVIEWER">Reviewer</option><option value="ADMIN">Admin</option></Select>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option value="ACTIVE">Active</option><option value="BLOCKED">Blocked</option></Select>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--muted-bg)] text-xs uppercase text-[var(--muted)]">
              <tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th><th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {users.data?.data.map((user) => (
                <tr key={user.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-4"><p className="font-semibold">{user.name}</p><p className="mt-1 text-xs text-[var(--muted)]">{user.email}</p></td>
                  <td className="px-4 py-4">
                    <Select className="w-36" value={user.role} onChange={(e) => changeRole.mutate({ userId: user.id, next: e.target.value as Role })}><option value="CANDIDATE">Candidate</option><option value="REVIEWER">Reviewer</option><option value="ADMIN">Admin</option></Select>
                  </td>
                  <td className="px-4 py-4"><Badge tone={user.status === "ACTIVE" ? "green" : "red"}>{user.status}</Badge></td>
                  <td className="px-4 py-4 text-[var(--muted)]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-4"><div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => changeStatus.mutate({ userId: user.id, next: user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" })}>{user.status === "ACTIVE" ? "Block" : "Activate"}</Button>
                    <Button variant="danger" onClick={() => window.confirm(`Soft-delete ${user.email}?`) && remove.mutate(user.id)}>Delete</Button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.isLoading && users.data?.data.length === 0 && <p className="p-8 text-center text-sm text-[var(--muted)]">No users match the current filters.</p>}
        </div>
        {(changeRole.error || changeStatus.error || remove.error) && <p className="mt-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-600">{(changeRole.error ?? changeStatus.error ?? remove.error)?.message}</p>}
      </section>

      <section className="mt-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><h2 className="text-xl font-bold">Audit activity</h2><p className="mt-1 text-sm text-[var(--muted)]">Critical account and assessment actions from the backend audit trail.</p></div>
          <Input className="sm:w-64" placeholder="Filter by action..." value={auditSearch} onChange={(e) => setAuditSearch(e.target.value)} />
        </div>
        <div className="mt-5 grid gap-3">
          {audit.data?.data.map((log) => (
            <Card key={log.id} className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div><div className="flex flex-wrap items-center gap-2"><Shield size={16} className="text-[var(--primary)]" /><p className="font-semibold">{log.action}</p><Badge>{log.entityType}</Badge></div><p className="mt-2 text-xs text-[var(--muted)]">{log.actor ? `${log.actor.name} · ${log.actor.email}` : "System"} · {new Date(log.createdAt).toLocaleString()}</p></div>
              {log.entityId && <code className="text-xs text-[var(--muted)]">{log.entityId.slice(0, 12)}…</code>}
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ icon: Icon, label, value, detail }: { icon: typeof UsersRound; label: string; value: number | string; detail: string }) {
  return <Card><Icon size={20} className="text-[var(--primary)]" /><p className="mt-4 text-sm font-semibold text-[var(--muted)]">{label}</p><p className="mt-1 text-3xl font-bold">{value}</p><p className="mt-2 text-xs text-[var(--muted)]">{detail}</p></Card>;
}
