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
      baseColor="#2563EB"
      accentColor="#67E8F9"
      highlight="#F8FAFC"
      density={26}
      speed={100}
      hover={200}
      reach={26}
      intensity={145}
      lightMode={false}
    />
  );
}
