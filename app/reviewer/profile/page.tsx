import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = {
  title: "Reviewer Profile",
  description: "Update the signed-in reviewer profile and avatar.",
};

export default function ReviewerProfilePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Reviewer settings</p>
      <h1 className="mt-1 text-3xl font-bold">Reviewer profile</h1>
      <p className="mt-2 text-[var(--muted)]">Manage your account identity used across authored assessments and reviews.</p>
      <ProfileForm />
    </main>
  );
}
