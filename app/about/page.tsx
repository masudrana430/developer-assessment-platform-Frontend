import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutCapabilityGrid } from "@/components/about/about-capability-grid";

export const metadata: Metadata = {
  title: "About",
  description:
    "Explore the connected assessment workflow inside DevAssess.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--primary)]">
                Inside the platform
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Built as one connected assessment workflow.
              </h1>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
              Move your pointer into any panel from a different edge. The
              directional reveal mirrors how each part of DevAssess connects
              into the wider platform.
            </p>
          </div>

          <AboutCapabilityGrid />

          <div className="mt-8 flex items-center justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
            <div>
              <p className="font-bold">
                Ready to see the workflow in action?
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Browse the currently published assessments and follow the
                candidate journey from enrollment onward.
              </p>
            </div>
            <Link
              href="/assessments"
              className="hidden shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--muted-bg)] sm:inline-flex"
            >
              Browse assessments <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
