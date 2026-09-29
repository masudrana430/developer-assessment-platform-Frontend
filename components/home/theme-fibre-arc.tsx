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
      baseColor={dark ? "#2563EB" : "#2563EB"}
      accentColor={dark ? "#67E8F9" : "#0891B2"}
      highlight={dark ? "#F8FAFC" : "#60A5FA"}
      density={26}
      speed={100}
      hover={200}
      reach={dark ? 26 : 28}
      intensity={dark ? 145 : 132}
      lightMode={!dark}
    />
  );
}
