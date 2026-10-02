"use client";

import dynamic from "next/dynamic";
import useSmallDevice from "@/hooks/use-small-device";

const DesktopGlowingEffect = dynamic(
  () =>
    import("@/components/ui/glowing-effect").then(
      (module) => module.GlowingEffect,
    ),
  { ssr: false },
);

type Props = {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
};

export function ResponsiveGlowingEffect(props: Props) {
  const small = useSmallDevice();

  if (small !== false) {
    return null;
  }

  return <DesktopGlowingEffect {...props} />;
}
