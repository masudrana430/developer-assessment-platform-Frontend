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
      <FloatingLines
        linesGradient={["#2563EB", "#06B6D4", "#60A5FA", "#8B5CF6"]}
        enabledWaves={["top", "middle", "bottom"]}
        lineCount={[5, 7, 5]}
        lineDistance={[5, 4, 6]}
        topWavePosition={{ x: 10, y: 0.45, rotate: -0.35 }}
        middleWavePosition={{ x: 5, y: 0, rotate: 0.16 }}
        bottomWavePosition={{ x: 2, y: -0.75, rotate: -0.8 }}
        animationSpeed={0.78}
        interactive
        bendRadius={5}
        bendStrength={-0.38}
        mouseDamping={0.06}
        parallax
        parallaxStrength={0.12}
        backgroundColor="#EEF6FF"
        lightMode
      />
    );
  }

  return <DesktopThemeFibreArc />;
}
