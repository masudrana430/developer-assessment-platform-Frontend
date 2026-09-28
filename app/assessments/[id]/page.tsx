import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CircleDollarSign, Clock3, ListChecks, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { EnrollCard } from "@/components/assessments/enroll-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { publicServerFetch } from "@/lib/server-api";
import type { ApiResponse, Assessment } from "@/types";

type PageProps = { params: Promise<{ id: string }> };

async function getAssessment(id: string) {
  try {
    const response = await publicServerFetch<ApiResponse<Assessment>>(`/assessments/${id}`, {
      next: { revalidate: 30 },
    });
    return response.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const assessment = await getAssessment(id);
  if (!assessment) return { title: "Assessment not found" };

  return {
    title: assessment.title,
    description: assessment.description.slice(0, 155),
    openGraph: {
      title: assessment.title,
      description: assessment.description.slice(0, 155),
      type: "website",
    },
  };
}

export default async function AssessmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const assessment = await getAssessment(id);
  if (!assessment) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/assessments" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)]">
        <ArrowLeft size={16} /> Back to assessments
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6 sm:p-8">
          <Badge tone="blue">{assessment.difficulty}</Badge>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{assessment.title}</h1>
          <p className="mt-5 whitespace-pre-wrap leading-7 text-[var(--muted)]">{assessment.description}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Info icon={Clock3} value={`${assessment.durationMinutes} minutes`} label="Time limit" />
            <Info icon={ListChecks} value={`${assessment._count?.questions ?? 0} questions`} label="Assessment items" />
            <Info icon={CircleDollarSign} value={assessment.feeCents ? `${(assessment.feeCents / 100).toFixed(2)} ${assessment.currency.toUpperCase()}` : "Free"} label="Enrollment fee" />
            <Info icon={UserRound} value={assessment.creator?.name ?? "Platform reviewer"} label="Created by" />
          </div>
        </Card>

        <EnrollCard assessment={assessment} />
      </div>
    </main>
  );
}

function Info({ icon: Icon, value, label }: { icon: typeof Clock3; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-[var(--muted-bg)] p-4">
      <Icon size={18} className="text-[var(--primary)]" />
      <p className="mt-2 font-bold">{value}</p>
      <p className="text-xs text-[var(--muted)]">{label}</p>
    </div>
  );
}
