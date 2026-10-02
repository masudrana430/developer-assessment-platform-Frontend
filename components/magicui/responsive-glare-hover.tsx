"use client";

import dynamic from "next/dynamic";
import type { CSSProperties, ReactNode } from "react";
import useSmallDevice from "@/hooks/use-small-device";

const DesktopGlareHover = dynamic(
  () =>
    import("@/components/magicui/glare-hover").then(
      (module) => module.GlareHover,
    ),
  { ssr: false },
);

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  width?: string;
  height?: string;
  background?: string;
  color?: `#${string}`;
  opacity?: number;
  angle?: number;
  size?: number;
  duration?: number;
  playOnce?: boolean;
};

export function ResponsiveGlareHover({
  children,
  className,
  style,
  width,
  height,
  ...desktopProps
}: Props) {
  const small = useSmallDevice();

  if (small === false) {
    return (
      <DesktopGlareHover
        className={className}
        style={style}
        width={width}
        height={height}
        {...desktopProps}
      >
        {children}
      </DesktopGlareHover>
    );
  }

  return (
    <div
      className={className}
      style={{
        ...style,
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
      }}
    >
      {children}
    </div>
  );
}
