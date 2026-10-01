"use client";

import {
  BadgeCheck,
  BarChart3,
  CreditCard,
  ShieldCheck,
  TimerReset,
  UsersRound,
} from "lucide-react";
import MagicBento, {
  type BentoCardProps,
} from "@/components/reactbits/magic-bento/MagicBento";

const cards: BentoCardProps[] = [
  {
    color: "#120F17",
    label: "Assessment",
    title: "Timed assessments",
    description:
      "Candidates start secure, timed attempts with auto-saved answers.",
    icon: <TimerReset aria-hidden="true" />,
  },
  {
    color: "#120F17",
    label: "Payments",
    title: "Stripe Checkout",
    description:
      "Paid assessments use a real Stripe-hosted checkout workflow.",
    icon: <CreditCard aria-hidden="true" />,
  },
  {
    color: "#120F17",
    label: "Access",
    title: "Three clear roles",
    description:
      "Purpose-built experiences for Candidates, Reviewers and Admins.",
    icon: <UsersRound aria-hidden="true" />,
  },
  {
    color: "#120F17",
    label: "Evaluation",
    title: "Structured grading",
    description:
      "MCQs are auto-scored while reviewers grade subjective responses.",
    icon: <BadgeCheck aria-hidden="true" />,
  },
  {
    color: "#120F17",
    label: "Security",
    title: "Protected workflows",
    description:
      "Role checks, state transitions and audit trails are enforced by the API.",
    icon: <ShieldCheck aria-hidden="true" />,
  },
  {
    color: "#120F17",
    label: "Operations",
    title: "Operational visibility",
    description:
      "Admin statistics and audit logs make the platform easy to supervise.",
    icon: <BarChart3 aria-hidden="true" />,
  },
];

export default function FeatureMagicBento() {
  return (
    <MagicBento
      cards={cards}
      textAutoHide={false}
      enableStars
      enableSpotlight
      enableBorderGlow
      disableAnimations={false}
      spotlightRadius={400}
      particleCount={12}
      enableTilt={false}
      glowColor="132, 0, 255"
      clickEffect
      enableMagnetism={false}
    />
  );
}
