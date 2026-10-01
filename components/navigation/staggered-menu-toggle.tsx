"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

type StaggeredMenuToggleProps = {
  open: boolean;
  onToggle: () => void;
};

export default function StaggeredMenuToggle({
  open,
  onToggle,
}: StaggeredMenuToggleProps) {
  const iconRef = useRef<HTMLSpanElement>(null);
  const horizontalRef = useRef<HTMLSpanElement>(null);
  const verticalRef = useRef<HTMLSpanElement>(null);
  const initializedRef = useRef(false);

  useLayoutEffect(() => {
    const icon = iconRef.current;
    const horizontal = horizontalRef.current;
    const vertical = verticalRef.current;
    if (!icon || !horizontal || !vertical) return;

    if (!initializedRef.current) {
      gsap.set(horizontal, {
        transformOrigin: "50% 50%",
        rotate: 0,
      });
      gsap.set(vertical, {
        transformOrigin: "50% 50%",
        rotate: 90,
      });
      gsap.set(icon, {
        rotate: open ? 225 : 0,
        transformOrigin: "50% 50%",
      });
      initializedRef.current = true;
      return;
    }

    const tween = gsap.to(icon, {
      rotate: open ? 225 : 0,
      duration: open ? 0.8 : 0.35,
      ease: open ? "power4.out" : "power3.inOut",
      overwrite: "auto",
    });

    return () => {
      tween.kill();
    };
  }, [open]);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "group relative grid h-10 w-10 place-items-center rounded-xl border transition-all duration-200",
        open
          ? "border-blue-500/40 bg-blue-600 text-white shadow-[0_8px_22px_rgba(37,99,235,0.22)] dark:border-blue-400/30 dark:bg-blue-500"
          : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-blue-300/70 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-white/15 dark:hover:bg-white/[0.07] dark:hover:text-cyan-100",
      ].join(" ")}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      <span
        ref={iconRef}
        aria-hidden="true"
        className="relative inline-flex h-[16px] w-[16px] items-center justify-center will-change-transform"
      >
        <span
          ref={horizontalRef}
          className="absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
        />
        <span
          ref={verticalRef}
          className="absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
        />
      </span>
    </button>
  );
}
