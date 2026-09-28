"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, Trash2, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryState } from "@/hooks/use-query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import type { ApiResponse, Role, User, UserStatus } from "@/types";

export function AdminUsers() {
  const queryClient = useQueryClient();
  const { searchParams, setQuery } = useQueryState();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const role = searchParams.get("role") ?? "";
  const status = searchParams.get("status") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debounced = useDebounce(search);

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (current !== debounced) setQuery({ search: debounced || null }, true);
  }, [debounced, searchParams, setQuery]);

  const users = useQuery({
    queryKey: ["admin-users", page, debounced, role, status, sortOrder],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: "10", sortOrder });
      if (debounced) params.set("search", debounced);
      if (role) params.set("role", role);
      if (status) params.set("status", status);
      return apiRequest<ApiResponse<User[]>>(`/admin/users?${params.toString()}`, { auth: true });
    },
  });

  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  const updateStatus = useMutation({
    mutationFn: ({ userId, next }: { userId: string; next: UserStatus }) =>
      apiRequest<ApiResponse<User>>(`/admin/users/${userId}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status: next }),
      }),
    onMutate: async ({ userId, next }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-users"] });
      const snapshots = queryClient.getQueriesData<ApiResponse<User[]>>({ queryKey: ["admin-users"] });
      queryClient.setQueriesData<ApiResponse<User[]>>({ queryKey: ["admin-users"] }, (old) =>
        old
          ? {
              ...old,
              data: old.data.map((user) => (user.id === userId ? { ...user, status: next } : user)),
            }
          : old,
      );
      return { snapshots };
    },
    onError: (error, _variables, context) => {
      context?.snapshots.forEach(([key, value]) => queryClient.setQueryData(key, value));
      toast.error(error instanceof Error ? error.message : "Unable to update status");
    },
    onSuccess: () => toast.success("User status updated"),
    onSettled: refresh,
  });

  const updateRole = useMutation({
    mutationFn: ({ userId, next }: { userId: string; next: Role }) =>
      apiRequest<ApiResponse<User>>(`/admin/users/${userId}/role`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ role: next }),
      }),
    onMutate: async ({ userId, next }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-users"] });
      const snapshots = queryClient.getQueriesData<ApiResponse<User[]>>({ queryKey: ["admin-users"] });
      queryClient.setQueriesData<ApiResponse<User[]>>({ queryKey: ["admin-users"] }, (old) =>
        old
          ? {
              ...old,
              data: old.data.map((user) => (user.id === userId ? { ...user, role: next } : user)),
            }
          : old,
      );
      return { snapshots };
    },
    onError: (error, _variables, context) => {
      context?.snapshots.forEach(([key, value]) => queryClient.setQueryData(key, value));
      toast.error(error instanceof Error ? error.message : "Unable to update role");
    },
    onSuccess: () => toast.success("User role updated"),
    onSettled: refresh,
  });

  const remove = useMutation({
    mutationFn: (userId: string) => apiRequest<ApiResponse<null>>(`/admin/users/${userId}`, { method: "DELETE", auth: true }),
    onSuccess: () => { toast.success("User soft-deleted"); refresh(); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to delete user"),
  });

  return (
    <>
      <div className="mt-6 grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 md:grid-cols-[1fr_160px_160px_160px]">
        <SearchInput value={search} onChange={setSearch} placeholder="Search name or email" />
        <Select value={role} onChange={(event) => setQuery({ role: event.target.value || null }, true)}>
          <option value="">All roles</option><option value="CANDIDATE">Candidate</option><option value="REVIEWER">Reviewer</option><option value="ADMIN">Admin</option>
        </Select>
        <Select value={status} onChange={(event) => setQuery({ status: event.target.value || null }, true)}>
          <option value="">All statuses</option><option value="ACTIVE">Active</option><option value="BLOCKED">Blocked</option>
        </Select>
        <Select value={sortOrder} onChange={(event) => setQuery({ sortOrder: event.target.value }, true)}>
          <option value="desc">Newest first</option><option value="asc">Oldest first</option>
        </Select>
      </div>

      {users.error ? <p className="mt-5 rounded-xl bg-red-500/10 p-4 text-sm text-red-600">{users.error instanceof Error ? users.error.message : "Unable to load users"}</p> : null}

      <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--muted-bg)] text-xs uppercase text-[var(--muted)]">
            <tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th><th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {users.data?.data.map((user) => (
              <tr key={user.id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-4"><p className="font-semibold">{user.name}</p><p className="mt-1 text-xs text-[var(--muted)]">{user.email}</p></td>
                <td className="px-4 py-4">
                  <Select className="w-36" value={user.role} onChange={(event) => updateRole.mutate({ userId: user.id, next: event.target.value as Role })}>
                    <option value="CANDIDATE">Candidate</option><option value="REVIEWER">Reviewer</option><option value="ADMIN">Admin</option>
                  </Select>
                </td>
                <td className="px-4 py-4"><Badge tone={user.status === "ACTIVE" ? "green" : "red"}>{user.status}</Badge></td>
                <td className="px-4 py-4 text-[var(--muted)]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => updateStatus.mutate({ userId: user.id, next: user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" })}>
                      {user.status === "ACTIVE" ? "Block" : "Activate"}
                    </Button>
                    <ConfirmDialog
                      trigger={<Button variant="danger"><Trash2 size={15} /> Delete</Button>}
                      title="Soft-delete this user?"
                      description={`${user.email} will be blocked and hidden while historical assessment data remains preserved.`}
                      confirmLabel="Delete user"
                      destructive
                      onConfirm={() => remove.mutate(user.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!users.isLoading && users.data?.data.length === 0 ? (
          <div className="p-6"><EmptyState icon={UsersRound} title="No users found" description="No active user matches the current URL filters." /></div>
        ) : null}
      </div>

      {users.data?.meta && users.data.meta.totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
          <button className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-40" disabled={page <= 1} onClick={() => setQuery({ page: page - 1 })}>Previous</button>
          <span className="text-sm text-[var(--muted)]">Page {users.data.meta.page} of {users.data.meta.totalPages}</span>
          <button className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold disabled:opacity-40" disabled={page >= users.data.meta.totalPages} onClick={() => setQuery({ page: page + 1 })}>Next</button>
        </div>
      ) : null}

      <p className="mt-4 flex items-center gap-2 text-xs text-[var(--muted)]"><ShieldAlert size={14} /> Role changes may be rejected by the backend while a user has active assessment work.</p>
    </>
  );
}
