"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/components/theme-provider";
import useLargeDevice from "@/hooks/use-large-device";
import useSmallDevice from "@/hooks/use-small-device";

const DesktopThemeFibreArc = dynamic(
  () => import("@/components/home/theme-fibre-arc"),
  { ssr: false },
);

const FloatingLines = dynamic(
  () => import("@/components/reactbits/floating-lines/FloatingLines"),
  { ssr: false },
);

function StaticHeroBackground({ dark }: { dark: boolean }) {
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

export default function ThemeFibreArcResponsive() {
  const small = useSmallDevice();
  const large = useLargeDevice();
  const { theme, ready } = useTheme();
  const dark = ready ? theme === "dark" : true;

  if (!ready || small === null || large === null) {
    return <StaticHeroBackground dark={dark} />;
  }

  if (small) {
    return <StaticHeroBackground dark={dark} />;
  }

  if (large && !dark) {
    return (
      <div style={{ width: "100%", height: "600px", position: "relative" }}>
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={8}
          lineDistance={8}
          bendRadius={8}
          bendStrength={-2}
          interactive
          parallax={true}
          animationSpeed={1}
          gradientStart="#6d28d9"
          gradientMid="#ec4899"
          gradientEnd="#06b6d4"
          lightMode
          backgroundColor="#ffffff"
        />
      </div>
    );
  }

  return <DesktopThemeFibreArc />;
}
