"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/components/theme-provider";
import useSmallDevice from "@/hooks/use-small-device";

const DesktopAuthRibbonBackground = dynamic(
  () => import("@/components/auth/auth-ribbon-background"),
  { ssr: false },
);

export default function AuthRibbonBackgroundResponsive() {
  const small = useSmallDevice();
  const { theme, ready } = useTheme();
  const dark = ready ? theme === "dark" : true;

  if (small === false) {
    return <DesktopAuthRibbonBackground />;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? "radial-gradient(circle at 24% 26%, rgba(47,211,242,0.16), transparent 31%), radial-gradient(circle at 78% 68%, rgba(123,97,255,0.16), transparent 35%), #0B0A10"
            : "radial-gradient(circle at 24% 26%, rgba(37,99,235,0.14), transparent 31%), radial-gradient(circle at 78% 68%, rgba(139,92,246,0.12), transparent 35%), #EEF6FF",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/10 dark:from-black/5 dark:to-black/20" />
    </div>
  );
}
