import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = {
  title: "Candidate Profile",
  description: "Update your DevAssess candidate profile and Cloudinary-backed profile image.",
};

export default function CandidateProfilePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold text-[var(--primary)]">Candidate settings</p>
      <h1 className="mt-1 text-3xl font-bold">Profile & settings</h1>
      <p className="mt-2 text-[var(--muted)]">Manage the information attached to your candidate account.</p>
      <ProfileForm />
    </main>
  );
}
