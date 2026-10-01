"use client";

import { useEffect, useRef } from "react";

type RGB = [number, number, number];

type CanvasRevealEffectProps = {
  active?: boolean;
  animationSpeed?: number;
  colors?: RGB[];
  dotSize?: number;
  containerClassName?: string;
};

function mixColor(colors: RGB[], t: number): RGB {
  if (colors.length === 1) return colors[0];
  const scaled = Math.max(0, Math.min(0.999, t)) * (colors.length - 1);
  const index = Math.floor(scaled);
  const local = scaled - index;
  const a = colors[index];
  const b = colors[Math.min(colors.length - 1, index + 1)];

  return [
    Math.round(a[0] + (b[0] - a[0]) * local),
    Math.round(a[1] + (b[1] - a[1]) * local),
    Math.round(a[2] + (b[2] - a[2]) * local),
  ];
}

export function CanvasRevealEffect({
  active = true,
  animationSpeed = 3,
  colors = [
    [37, 99, 235],
    [34, 211, 238],
  ],
  dotSize = 2,
  containerClassName = "",
}: CanvasRevealEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let disposed = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let startedAt = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      if (disposed) return;

      const elapsed = (now - startedAt) / 1000;
      context.clearRect(0, 0, width, height);

      const spacing = Math.max(12, dotSize * 6.5);
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      for (let row = -1; row < rows; row += 1) {
        for (let col = -1; col < cols; col += 1) {
          const x = col * spacing;
          const y = row * spacing;
          const nx = width > 0 ? x / width : 0;
          const ny = height > 0 ? y / height : 0;

          const sweep =
            Math.sin(
              nx * 8.2 +
                ny * 5.7 -
                elapsed * animationSpeed * 1.35 +
                Math.sin(ny * 7 + elapsed) * 0.7,
            ) *
              0.5 +
            0.5;

          const ripple =
            Math.sin(
              Math.hypot(nx - 0.48, ny - 0.5) * 18 -
                elapsed * animationSpeed * 1.1,
            ) *
              0.5 +
            0.5;

          const visibility = Math.max(0, sweep * 0.72 + ripple * 0.52 - 0.33);
          if (visibility < 0.08) continue;

          const [r, g, b] = mixColor(colors, (nx + ny + sweep) / 3);
          const radius = dotSize * (0.55 + visibility * 0.7);

          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fillStyle =
            "rgba(" +
            r +
            "," +
            g +
            "," +
            b +
            "," +
            Math.min(0.95, visibility).toFixed(3) +
            ")";
          context.fill();
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    startedAt = performance.now();
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      observer.disconnect();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      context.clearRect(0, 0, width, height);
    };
  }, [active, animationSpeed, colors, dotSize]);

  return (
    <div
      className={[
        "pointer-events-none absolute inset-0 overflow-hidden",
        containerClassName,
      ].join(" ")}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
