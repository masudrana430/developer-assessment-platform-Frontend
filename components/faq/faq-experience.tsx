"use client";

import dynamic from "next/dynamic";
import useSmallDevice from "@/hooks/use-small-device";

const FlowingMenu = dynamic(
  () => import("@/components/reactbits/flowing-menu/FlowingMenu"),
  { ssr: false },
);

export type FaqEntry = {
  question: string;
  answer: string;
};

const demoImages = [
  "https://images.unsplash.com/photo-1782977389500-dd7adad33ebe?q=80&w=600&h=400&fit=crop&sat=-100&auto=format",
  "https://images.unsplash.com/photo-1781499455083-6ccc3beb20cd?q=80&w=600&h=400&fit=crop&sat=-100&auto=format",
  "https://images.unsplash.com/photo-1776394254711-4a0d7345269a?q=80&w=600&h=400&fit=crop&sat=-100&auto=format",
  "https://images.unsplash.com/photo-1781242629922-6f39cc3671cd?q=80&w=600&h=400&fit=crop&sat=-100&auto=format",
] as const;

export default function FaqExperience({ faqs }: { faqs: FaqEntry[] }) {
  const small = useSmallDevice();

  if (small !== false) {
    return (
      <div className="grid gap-3">
        {faqs.map((faq) => (
          <article
            key={faq.question}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
          >
            <h2 className="font-bold">{faq.question}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {faq.answer}
            </p>
          </article>
        ))}
      </div>
    );
  }

  const items = faqs.map((faq, index) => ({
    link: `#faq-answer-${index + 1}`,
    text: faq.question,
    image: demoImages[index % demoImages.length],
  }));

  return (
    <>
      <div
        className="relative h-[600px] overflow-hidden rounded-[2rem] border border-white/20"
        style={{ position: "relative" }}
      >
        <FlowingMenu
          items={items}
          speed={15}
          textColor="#ffffff"
          bgColor="#120F17"
          marqueeBgColor="#ffffff"
          marqueeTextColor="#120F17"
          borderColor="#ffffff"
        />
      </div>

      <section className="mt-12 grid gap-4 lg:grid-cols-2">
        {faqs.map((faq, index) => (
          <article
            id={`faq-answer-${index + 1}`}
            key={faq.question}
            className="scroll-mt-24 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
              FAQ {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 text-xl font-bold">{faq.question}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {faq.answer}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}
