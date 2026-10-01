"use client";

import { useEffect, useRef } from "react";

export default function TrustCursorBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const primary = primaryRef.current;
    const secondary = secondaryRef.current;
    const ring = ringRef.current;
    if (!root || !primary || !secondary || !ring) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pointer = {
      tx: 0.5,
      ty: 0.45,
      x: 0.5,
      y: 0.45,
      sx: 0.5,
      sy: 0.45,
      inside: false,
      opacity: 0.42,
      targetOpacity: 0.42,
    };

    let raf = 0;
    let disposed = false;

    const readPointer = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      pointer.inside = inside;
      pointer.targetOpacity = inside ? 1 : 0.42;

      if (!inside) return;

      pointer.tx = (event.clientX - rect.left) / Math.max(1, rect.width);
      pointer.ty = (event.clientY - rect.top) / Math.max(1, rect.height);
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        pointer.inside = false;
        pointer.targetOpacity = 0.42;
      }
    };

    const render = () => {
      if (disposed) return;

      const mainEase = reducedMotion ? 1 : 0.16;
      const trailEase = reducedMotion ? 1 : 0.075;
      const opacityEase = reducedMotion ? 1 : 0.12;

      pointer.x += (pointer.tx - pointer.x) * mainEase;
      pointer.y += (pointer.ty - pointer.y) * mainEase;
      pointer.sx += (pointer.x - pointer.sx) * trailEase;
      pointer.sy += (pointer.y - pointer.sy) * trailEase;
      pointer.opacity += (pointer.targetOpacity - pointer.opacity) * opacityEase;

      const mainX = pointer.x * 100;
      const mainY = pointer.y * 100;
      const trailX = pointer.sx * 100;
      const trailY = pointer.sy * 100;

      primary.style.left = mainX + "%";
      primary.style.top = mainY + "%";
      primary.style.opacity = String(pointer.opacity);

      ring.style.left = mainX + "%";
      ring.style.top = mainY + "%";
      ring.style.opacity = String(Math.max(0.2, pointer.opacity * 0.72));

      secondary.style.left = trailX + "%";
      secondary.style.top = trailY + "%";
      secondary.style.opacity = String(Math.max(0.18, pointer.opacity * 0.55));

      raf = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", readPointer, { passive: true });
    window.addEventListener("pointerdown", readPointer, { passive: true });
    document.addEventListener("pointerout", onPointerOut);

    raf = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", readPointer);
      window.removeEventListener("pointerdown", readPointer);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter
            id="trust-liquid-cursor"
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05 0.05"
              numOctaves="1"
              seed="1"
              result="turbulence"
            >
              <animate
                attributeName="baseFrequency"
                dur="8s"
                values="0.045 0.05;0.065 0.04;0.05 0.065;0.045 0.05"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feGaussianBlur
              in="turbulence"
              stdDeviation="2"
              result="blurredNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurredNoise"
              scale="70"
              xChannelSelector="R"
              yChannelSelector="B"
              result="displaced"
            />
            <feGaussianBlur
              in="displaced"
              stdDeviation="4"
              result="finalBlur"
            />
            <feComposite
              in="finalBlur"
              in2="SourceGraphic"
              operator="over"
            />
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_84%_14%,rgba(34,211,238,0.08),transparent_26%)]" />

      <div className="absolute inset-0 opacity-[0.11] [background-image:linear-gradient(rgba(125,211,252,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.16)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

      <div
        ref={secondaryRef}
        className="absolute h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.26)_0%,rgba(37,99,235,0.16)_34%,rgba(34,211,238,0.06)_58%,transparent_76%)] blur-2xl will-change-[left,top,opacity]"
      />

      <div
        ref={primaryRef}
        className="absolute h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.44)_0%,rgba(59,130,246,0.28)_24%,rgba(99,102,241,0.18)_44%,transparent_72%)] will-change-[left,top,opacity]"
        style={{ filter: 'url("#trust-liquid-cursor")' }}
      />

      <div
        ref={ringRef}
        className="absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/20 shadow-[0_0_55px_rgba(34,211,238,0.15),inset_0_0_38px_rgba(96,165,250,0.08)] backdrop-blur-[1px] will-change-[left,top,opacity]"
      >
        <div className="absolute inset-5 rounded-full border border-blue-200/10" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(165,243,252,0.95)]" />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#071426] via-[#071426]/55 to-transparent" />
    </div>
  );
}
