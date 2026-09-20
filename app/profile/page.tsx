"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Camera, UserRound } from "lucide-react";
import { RequireAuth } from "@/components/guard";
import { useAuth } from "@/components/auth-provider";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ApiResponse, User } from "@/types";

export default function ProfilePage() {
  return <RequireAuth><ProfileContent /></RequireAuth>;
}

function ProfileContent() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState("");

  useEffect(() => setName(user?.name ?? ""), [user]);

  const update = useMutation({
    mutationFn: () => apiRequest<ApiResponse<User>>("/users/me", { method: "PATCH", auth: true, body: JSON.stringify({ name }) }),
    onSuccess: () => void refreshUser(),
  });

  const avatar = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("profileImage", file);
      return apiRequest<ApiResponse<User>>("/users/me/avatar", { method: "PATCH", auth: true, body: form });
    },
    onSuccess: () => void refreshUser(),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    update.mutate();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="mt-2 text-[var(--muted)]">Manage the basic information attached to your account.</p>

      <Card className="mt-8 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[var(--muted-bg)]">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" /> : <UserRound size={36} className="text-[var(--muted)]" />}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{user?.email} · {user?.role}</p>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--muted-bg)]">
              <Camera size={16} /> {avatar.isPending ? "Uploading..." : "Change avatar"}
              <input type="file" className="hidden" accept="image/png,image/jpeg,image/webp" disabled={avatar.isPending} onChange={(e) => { const file = e.target.files?.[0]; if (file) avatar.mutate(file); }} />
            </label>
          </div>
        </div>

        <form className="mt-8 max-w-lg" onSubmit={submit}>
          <label className="block text-sm font-semibold">Display name<Input className="mt-1.5" value={name} minLength={2} onChange={(e) => setName(e.target.value)} /></label>
          <Button className="mt-4" disabled={update.isPending || name.trim().length < 2}>{update.isPending ? "Saving..." : "Save changes"}</Button>
        </form>

        {(update.error || avatar.error) && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600">{(update.error ?? avatar.error) instanceof Error ? (update.error ?? avatar.error)?.message : "Update failed"}</p>}
      </Card>
    </main>
  );
}
