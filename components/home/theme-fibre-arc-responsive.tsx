"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/components/theme-provider";
import useSmallDevice from "@/hooks/use-small-device";

const DesktopThemeFibreArc = dynamic(
  () => import("@/components/home/theme-fibre-arc"),
  { ssr: false },
);

export default function ThemeFibreArcResponsive() {
  const small = useSmallDevice();
  const { theme, ready } = useTheme();
  const dark = ready ? theme === "dark" : true;

  if (small === false) {
    return <DesktopThemeFibreArc />;
  }

  return (
    <div
      className="h-full w-full"
      style={{
        background: dark
          ? "radial-gradient(circle at 76% 28%, rgba(34,211,238,0.14), transparent 28%), radial-gradient(circle at 28% 64%, rgba(37,99,235,0.18), transparent 34%), #071426"
          : "radial-gradient(circle at 76% 28%, rgba(34,211,238,0.14), transparent 28%), radial-gradient(circle at 28% 64%, rgba(37,99,235,0.12), transparent 34%), #EEF6FF",
      }}
    />
  );
}
