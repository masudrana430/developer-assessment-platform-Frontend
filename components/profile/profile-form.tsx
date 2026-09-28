"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, LoaderCircle, UserRound } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";
import type { ApiResponse, User } from "@/types";

const schema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters").max(80),
});

type ProfileValues = z.infer<typeof schema>;

export function ProfileForm() {
  const { user, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(schema),
    values: { name: user?.name ?? "" },
  });

  async function save(values: ProfileValues) {
    try {
      await apiRequest<ApiResponse<User>>("/users/me", {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(values),
      });
      await refreshUser();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update profile");
    }
  }

  async function uploadAvatar(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile image must be 2 MB or smaller");
      return;
    }

    const form = new FormData();
    form.append("profileImage", file);

    try {
      toast.loading("Uploading avatar...", { id: "avatar-upload" });
      await apiRequest<ApiResponse<User>>("/users/me/avatar", {
        method: "PATCH",
        auth: true,
        body: form,
      });
      await refreshUser();
      toast.success("Profile image updated", { id: "avatar-upload" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Avatar upload failed", { id: "avatar-upload" });
    }
  }

  return (
    <Card className="mt-8 p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[var(--muted-bg)]">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={`${user.name} profile image`}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <UserRound size={36} className="text-[var(--muted)]" />
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{user?.email} · {user?.role}</p>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadAvatar(file);
              event.currentTarget.value = "";
            }}
          />
          <Button className="mt-4" type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
            <Camera size={16} /> Change avatar
          </Button>
          <p className="mt-2 text-xs text-[var(--muted)]">JPEG, PNG or WebP · maximum 2 MB</p>
        </div>
      </div>

      <form className="mt-8 max-w-lg" onSubmit={handleSubmit(save)} noValidate>
        <label className="block text-sm font-semibold">
          Display name
          <Input className="mt-1.5" {...register("name")} />
          {errors.name ? <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span> : null}
        </label>
        <Button className="mt-4" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="animate-spin" size={16} /> : null}
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
