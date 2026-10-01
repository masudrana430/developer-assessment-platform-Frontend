"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  MessageCircleMore,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type PhysicsBody = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  angle: number;
  angularVelocity: number;
  dragging: boolean;
  offsetX: number;
  offsetY: number;
  lastPointerX: number;
  lastPointerY: number;
  lastPointerTime: number;
};

const topics = [
  {
    label: "support",
    x: 0.12,
    y: 0.04,
    angle: -7,
    className: "bg-blue-600 text-white",
  },
  {
    label: "feedback",
    x: 0.33,
    y: 0.18,
    angle: 6,
    className: "bg-cyan-400 text-slate-950",
  },
  {
    label: "assessment setup",
    x: 0.48,
    y: 0.06,
    angle: -3,
    className: "bg-slate-950 text-white dark:bg-white dark:text-slate-950",
  },
  {
    label: "reviewer workflow",
    x: 0.68,
    y: 0.15,
    angle: 9,
    className: "bg-indigo-600 text-white",
  },
  {
    label: "partnerships",
    x: 0.79,
    y: 0.03,
    angle: -5,
    className: "bg-sky-500 text-white",
  },
  {
    label: "say hello 👋",
    x: 0.53,
    y: 0.28,
    angle: 4,
    className: "bg-violet-600 text-white",
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function GravityContact() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const bodyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const animationRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  function applyTransform(index: number) {
    const node = bodyRefs.current[index];
    const body = bodiesRef.current[index];
    if (!node || !body) return;

    node.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.angle}deg)`;
  }

  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;

    let disposed = false;
    let initialized = false;
    let lastFrame = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function measure(reset = false) {
      const bounds = arena.getBoundingClientRect();

      topics.forEach((topic, index) => {
        const node = bodyRefs.current[index];
        if (!node) return;

        const width = node.offsetWidth;
        const height = node.offsetHeight;
        const existing = bodiesRef.current[index];

        if (!existing || reset) {
          bodiesRef.current[index] = {
            x: clamp(bounds.width * topic.x - width / 2, 0, Math.max(0, bounds.width - width)),
            y: clamp(bounds.height * topic.y, 0, Math.max(0, bounds.height - height)),
            vx: (index % 2 === 0 ? 1 : -1) * (28 + index * 7),
            vy: 0,
            width,
            height,
            angle: topic.angle,
            angularVelocity: (index % 2 === 0 ? 1 : -1) * (5 + index),
            dragging: false,
            offsetX: 0,
            offsetY: 0,
            lastPointerX: 0,
            lastPointerY: 0,
            lastPointerTime: 0,
          };
        } else {
          existing.width = width;
          existing.height = height;
          existing.x = clamp(existing.x, 0, Math.max(0, bounds.width - width));
          existing.y = clamp(existing.y, 0, Math.max(0, bounds.height - height));
        }

        applyTransform(index);
      });

      if (!initialized) {
        initialized = true;
        setReady(true);
      }
    }

    function resolveCollisions() {
      const bodies = bodiesRef.current;

      for (let i = 0; i < bodies.length; i += 1) {
        for (let j = i + 1; j < bodies.length; j += 1) {
          const a = bodies[i];
          const b = bodies[j];
          if (!a || !b) continue;

          const overlapX =
            Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
          const overlapY =
            Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);

          if (overlapX <= 0 || overlapY <= 0) continue;

          if (overlapX < overlapY) {
            const direction = a.x + a.width / 2 < b.x + b.width / 2 ? -1 : 1;
            const correction = overlapX / 2 + 0.5;

            if (!a.dragging) a.x += direction * correction;
            if (!b.dragging) b.x -= direction * correction;

            const avx = a.vx;
            if (!a.dragging) a.vx = b.vx * 0.58;
            if (!b.dragging) b.vx = avx * 0.58;
          } else {
            const direction = a.y + a.height / 2 < b.y + b.height / 2 ? -1 : 1;
            const correction = overlapY / 2 + 0.5;

            if (!a.dragging) a.y += direction * correction;
            if (!b.dragging) b.y -= direction * correction;

            const avy = a.vy;
            if (!a.dragging) a.vy = b.vy * 0.48;
            if (!b.dragging) b.vy = avy * 0.48;
          }
        }
      }
    }

    function frame(now: number) {
      if (disposed) return;

      const dt = Math.min((now - lastFrame) / 1000, 0.032);
      lastFrame = now;
      const bounds = arena.getBoundingClientRect();
      const gravity = 880;
      const restitution = 0.5;

      bodiesRef.current.forEach((body) => {
        if (body.dragging) return;

        body.vy += gravity * dt;
        body.vx *= Math.pow(0.992, dt * 60);
        body.angularVelocity *= Math.pow(0.994, dt * 60);

        body.x += body.vx * dt;
        body.y += body.vy * dt;
        body.angle += body.angularVelocity * dt;

        const maxX = Math.max(0, bounds.width - body.width);
        const maxY = Math.max(0, bounds.height - body.height);

        if (body.x <= 0) {
          body.x = 0;
          body.vx = Math.abs(body.vx) * restitution;
          body.angularVelocity += 5;
        } else if (body.x >= maxX) {
          body.x = maxX;
          body.vx = -Math.abs(body.vx) * restitution;
          body.angularVelocity -= 5;
        }

        if (body.y <= 0) {
          body.y = 0;
          body.vy = Math.abs(body.vy) * restitution;
        } else if (body.y >= maxY) {
          body.y = maxY;
          body.vy = -Math.abs(body.vy) * restitution;
          body.vx *= 0.96;

          if (Math.abs(body.vy) < 20) body.vy = 0;
          if (Math.abs(body.vx) < 3) body.vx = 0;
        }
      });

      resolveCollisions();
      bodiesRef.current.forEach((_, index) => applyTransform(index));
      animationRef.current = requestAnimationFrame(frame);
    }

    const startId = requestAnimationFrame(() => {
      measure(true);

      if (!reducedMotion.matches) {
        lastFrame = performance.now();
        animationRef.current = requestAnimationFrame(frame);
      }
    });

    const observer = new ResizeObserver(() => measure(false));
    observer.observe(arena);

    return () => {
      disposed = true;
      cancelAnimationFrame(startId);
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      observer.disconnect();
    };
  }, []);

  function handlePointerDown(index: number, event: ReactPointerEvent<HTMLDivElement>) {
    const arena = arenaRef.current;
    const body = bodiesRef.current[index];
    if (!arena || !body) return;

    const bounds = arena.getBoundingClientRect();
    body.dragging = true;
    body.offsetX = event.clientX - bounds.left - body.x;
    body.offsetY = event.clientY - bounds.top - body.y;
    body.lastPointerX = event.clientX;
    body.lastPointerY = event.clientY;
    body.lastPointerTime = performance.now();
    body.vx = 0;
    body.vy = 0;

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(index: number, event: ReactPointerEvent<HTMLDivElement>) {
    const arena = arenaRef.current;
    const body = bodiesRef.current[index];
    if (!arena || !body?.dragging) return;

    const bounds = arena.getBoundingClientRect();
    const now = performance.now();
    const elapsed = Math.max((now - body.lastPointerTime) / 1000, 0.008);
    const dx = event.clientX - body.lastPointerX;
    const dy = event.clientY - body.lastPointerY;

    body.vx = (dx / elapsed) * 0.72;
    body.vy = (dy / elapsed) * 0.72;
    body.angularVelocity = dx * 5;

    body.x = clamp(
      event.clientX - bounds.left - body.offsetX,
      0,
      Math.max(0, bounds.width - body.width),
    );
    body.y = clamp(
      event.clientY - bounds.top - body.offsetY,
      0,
      Math.max(0, bounds.height - body.height),
    );
    body.angle += dx * 0.08;

    body.lastPointerX = event.clientX;
    body.lastPointerY = event.clientY;
    body.lastPointerTime = now;

    applyTransform(index);
  }

  function releaseBody(index: number, event: ReactPointerEvent<HTMLDivElement>) {
    const body = bodiesRef.current[index];
    if (!body) return;

    body.dragging = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section id="contact" className="px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="relative mx-auto min-h-[660px] max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-[0_24px_80px_rgba(37,99,235,0.08)] dark:bg-[#071426] dark:shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.10),transparent_26%)] dark:bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.12),transparent_26%)]" />

        <div className="relative z-20 mx-auto max-w-4xl px-6 pt-12 text-center sm:px-10 sm:pt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)] shadow-sm backdrop-blur-xl">
            <MessageCircleMore size={14} />
            Contact
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Have something in mind? Let&apos;s talk.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Questions about assessments, reviewer workflows, platform setup or feedback?
            Choose a starting point, then drag the topics below and watch them react.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/faq"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]"
            >
              Get help <ArrowUpRight size={17} />
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)]/85 px-5 py-3 text-sm font-semibold backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[var(--muted-bg)]"
            >
              About DevAssess
            </Link>
          </div>

          <p className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            <MousePointer2 size={14} />
            Drag the contact topics
          </p>
        </div>

        <div
          ref={arenaRef}
          className="absolute inset-x-4 bottom-4 top-[330px] overflow-hidden rounded-[1.5rem] border border-dashed border-blue-200/70 bg-blue-50/35 dark:border-white/10 dark:bg-white/[0.025] sm:inset-x-6 sm:bottom-6 sm:top-[320px]"
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-blue-100/45 to-transparent dark:from-blue-950/20" />

          {topics.map((topic, index) => (
            <div
              key={topic.label}
              ref={(node) => {
                bodyRefs.current[index] = node;
              }}
              onPointerDown={(event) => handlePointerDown(index, event)}
              onPointerMove={(event) => handlePointerMove(index, event)}
              onPointerUp={(event) => releaseBody(index, event)}
              onPointerCancel={(event) => releaseBody(index, event)}
              className={[
                "absolute left-0 top-0 z-10 touch-none select-none whitespace-nowrap rounded-full px-5 py-3 text-base font-bold shadow-xl shadow-slate-950/10 transition-shadow hover:cursor-grab hover:shadow-2xl active:cursor-grabbing sm:px-7 sm:py-4 sm:text-xl md:text-2xl",
                topic.className,
                ready ? "opacity-100" : "opacity-0",
              ].join(" ")}
              style={{
                transform: "translate3d(0, 0, 0)",
                willChange: "transform",
              }}
            >
              <span className="inline-flex items-center gap-2">
                {index === 5 ? <Sparkles size={18} /> : null}
                {topic.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
