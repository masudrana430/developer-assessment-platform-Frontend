import type { Metadata } from "next";
import FaqExperience from "@/components/faq/faq-experience";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about DevAssess assessments, payments, reviews and roles.",
};

const faqs = [
  {
    question: "Who can take assessments?",
    answer:
      "Only Candidate accounts can enroll, pay for and start assessment attempts.",
  },
  {
    question: "How are payments handled?",
    answer:
      "Paid assessments use Stripe Checkout in test mode. The backend confirms payment through Stripe webhooks before an attempt becomes ready.",
  },
  {
    question: "How are answers scored?",
    answer:
      "MCQ answers are scored automatically. TEXT and CODE responses can be scored by an assigned Reviewer.",
  },
  {
    question: "Can two reviewers claim the same submission?",
    answer:
      "No. The backend uses an atomic claim operation so a submitted attempt can only be assigned once.",
  },
  {
    question: "What can Admins do?",
    answer:
      "Admins can inspect statistics, search users, update roles and statuses, soft-delete eligible accounts and review audit logs.",
  },
  {
    question: "Does the frontend use mock data?",
    answer:
      "No core workflow uses mock data. Assessment, attempt, payment, review and admin data comes from the deployed backend API.",
  },
];

export default function FaqPage() {
  return (
    <main className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold text-[var(--primary)]">FAQ</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Hover over any question to reveal its answer through the flowing
            marquee interaction.
          </p>
        </div>

        <FaqExperience faqs={faqs} />
      </div>
    </main>
  );
}
