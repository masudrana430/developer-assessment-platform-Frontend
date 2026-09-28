import type { Metadata } from "next";
import { ReviewerOverview } from "@/components/reviewer/overview";

export const metadata: Metadata = {
  title: "Reviewer Dashboard",
  description: "Reviewer assessment authoring, review queue and assigned submission workflow.",
};

export default function ReviewerPage() {
  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><ReviewerOverview /></main>;
}
