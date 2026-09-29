"use client";

import FibreArc from "@/components/originkit/fibre-arc";
import { useTheme } from "@/components/theme-provider";

export default function ThemeFibreArc() {
  const { theme, ready } = useTheme();

  if (!ready) return null;

  const dark = theme === "dark";

  return (
    <FibreArc
      style={{ minWidth: 0, minHeight: 0, width: "100%", height: "100%" }}
      background={dark ? "#071426" : "#EEF6FF"}
      baseColor={dark ? "#2563EB" : "#1D4ED8"}
      accentColor={dark ? "#67E8F9" : "#0E7490"}
      highlight={dark ? "#F8FAFC" : "#2563EB"}
      density={26}
      speed={100}
      hover={200}
      reach={dark ? 26 : 28}
      intensity={dark ? 145 : 150}
      lightMode={!dark}
    />
  );
}
