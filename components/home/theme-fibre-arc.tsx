"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/components/theme-provider";
import useLightweightEffects from "@/hooks/use-lightweight-effects";

const FibreArc = dynamic(() => import("@/components/originkit/fibre-arc"), {
  ssr: false,
});

export default function ThemeFibreArc() {
  const { theme, ready } = useTheme();
  const lightweight = useLightweightEffects();

  if (!ready) return null;

  const dark = theme === "dark";

  if (lightweight) {
    return (
      <div
        className="h-full w-full"
        style={{
          background: dark
            ? "radial-gradient(circle at 76% 28%, rgba(34,211,238,0.16), transparent 28%), radial-gradient(circle at 30% 64%, rgba(37,99,235,0.20), transparent 34%), #071426"
            : "radial-gradient(circle at 76% 28%, rgba(34,211,238,0.18), transparent 28%), radial-gradient(circle at 30% 64%, rgba(37,99,235,0.16), transparent 34%), #EEF6FF",
        }}
      />
    );
  }

  return (
    <FibreArc
      style={{ minWidth: 0, minHeight: 0, width: "100%", height: "100%" }}
      background={dark ? "#071426" : "#EEF6FF"}
      baseColor="#2563EB"
      accentColor="#67E8F9"
      highlight="#F8FAFC"
      density={26}
      speed={100}
      hover={200}
      reach={26}
      intensity={145}
      lightMode={!dark}
    />
  );
}
