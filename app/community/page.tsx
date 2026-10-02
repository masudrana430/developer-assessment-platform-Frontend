import type { Metadata } from "next";
import CommunityScene from "@/components/community/community-scene-responsive";

export const metadata: Metadata = {
  title: "Join Our Community",
  description:
    "Join the DevAssess community of candidates, reviewers and developers exploring better assessment workflows.",
};

export default function CommunityPage() {
  return <CommunityScene />;
}
