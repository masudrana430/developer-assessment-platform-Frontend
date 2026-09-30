"use client";

import Link from "next/link";
import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  CreditCard,
  FileSearch,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

type Side = "left" | "right" | "top" | "bottom";

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

const ENTRANCE: Record<Side, string> = {
  left: BOTTOM_RIGHT_CLIP,
  bottom: BOTTOM_RIGHT_CLIP,
  top: BOTTOM_RIGHT_CLIP,
  right: TOP_LEFT_CLIP,
};

const EXIT: Record<Side, string> = {
  left: TOP_RIGHT_CLIP,
  bottom: TOP_RIGHT_CLIP,
  top: TOP_RIGHT_CLIP,
  right: BOTTOM_LEFT_CLIP,
};

type Tile = {
  title: string;
  eyebrow: string;
  href: string;
  Icon: LucideIcon;
};

const rows: Tile[][] = [
  [
    { title: "Candidate experience", eyebrow: "Discover · Enroll · Attempt", href: "/assessments", Icon: UsersRound },
    { title: "Reviewer workflow", eyebrow: "Create · Review · Evaluate", href: "/reviewer", Icon: ClipboardCheck },
  ],
  [
    { title: "Timed attempts", eyebrow: "Structured execution", href: "/features", Icon: Clock3 },
    { title: "Secure payments", eyebrow: "Stripe Checkout flow", href: "/pricing", Icon: CreditCard },
    { title: "Role-aware access", eyebrow: "Protected experiences", href: "/features", Icon: ShieldCheck },
    { title: "Audit visibility", eyebrow: "Operational traceability", href: "/admin/audit", Icon: FileSearch },
  ],
  [
    { title: "Structured grading", eyebrow: "Scoring & feedback", href: "/features", Icon: CheckCircle2 },
    { title: "Platform oversight", eyebrow: "Users & analytics", href: "/admin", Icon: BarChart3 },
    { title: "End-to-end workflow", eyebrow: "One connected system", href: "/features", Icon: Sparkles },
  ],
];

function nearestSide(e: ReactMouseEvent<HTMLElement>, node: HTMLElement): Side {
  const box = node.getBoundingClientRect();
  const proximity = [
    { proximity: Math.abs(e.clientX - box.left), side: "left" as const },
    { proximity: Math.abs(box.right - e.clientX), side: "right" as const },
    { proximity: Math.abs(e.clientY - box.top), side: "top" as const },
    { proximity: Math.abs(box.bottom - e.clientY), side: "bottom" as const },
  ].sort((a, b) => a.proximity - b.proximity);

  return proximity[0].side;
}

function LinkBox({ title, eyebrow, href, Icon }: Tile) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [clipPath, setClipPath] = useState(BOTTOM_RIGHT_CLIP);
  const [transition, setTransition] = useState("clip-path 360ms cubic-bezier(0.22, 1, 0.36, 1)");

  function handleEnter(e: ReactMouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return;
    const side = nearestSide(e, ref.current);
    setTransition("none");
    setClipPath(ENTRANCE[side]);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransition("clip-path 360ms cubic-bezier(0.22, 1, 0.36, 1)");
        setClipPath(NO_CLIP);
      });
    });
  }

  function handleLeave(e: ReactMouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return;
    const side = nearestSide(e, ref.current);
    setTransition("clip-path 300ms cubic-bezier(0.4, 0, 1, 1)");
    setClipPath(EXIT[side]);
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative grid min-h-32 w-full overflow-hidden place-content-center bg-white px-4 py-7 text-center text-slate-950 outline-none transition focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-[#071426] dark:text-white sm:min-h-40 md:min-h-48"
    >
      <div className="relative z-10 flex flex-col items-center">
        <Icon className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.7} />
        <p className="mt-4 text-sm font-bold sm:text-base">{title}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{eyebrow}</p>
      </div>

      <div
        aria-hidden="true"
        style={{ clipPath, transition }}
        className="pointer-events-none absolute inset-0 z-20 grid place-content-center bg-slate-950 px-4 py-7 text-center text-white dark:bg-white dark:text-slate-950"
      >
        <Icon className="mx-auto h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.7} />
        <p className="mt-4 text-sm font-bold sm:text-base">{title}</p>
        <p className="mt-1 text-xs text-slate-300 dark:text-slate-600">{eyebrow}</p>
      </div>
    </Link>
  );
}

export function AboutCapabilityGrid() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-950 bg-slate-950 shadow-2xl shadow-blue-950/10 dark:border-white/35 dark:bg-white/35">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={[
            "grid",
            rowIndex > 0 ? "border-t border-slate-950 dark:border-white/35" : "",
            row.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "",
            row.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "",
            row.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "",
          ].join(" ")}
        >
          {row.map((tile, index) => (
            <div
              key={tile.title}
              className={[
                index > 0 ? "border-l border-slate-950 dark:border-white/35" : "",
                row.length === 4 && index === 2 ? "max-lg:border-l-0 max-lg:border-t max-lg:border-slate-950 max-lg:dark:border-white/35" : "",
                row.length === 4 && index === 3 ? "max-lg:border-t max-lg:border-slate-950 max-lg:dark:border-white/35" : "",
                row.length !== 4 && index > 0 ? "max-sm:border-l-0 max-sm:border-t max-sm:border-slate-950 max-sm:dark:border-white/35" : "",
              ].join(" ")}
            >
              <LinkBox {...tile} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
