"use client";

import RibbonGlow from "@/components/originkit/ribbon-glow";
import { useTheme } from "@/components/theme-provider";

export default function AuthRibbonBackground() {
  const { theme, ready } = useTheme();
  const dark = ready ? theme === "dark" : true;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <RibbonGlow
        background={dark ? "#0B0A10" : "#EEF6FF"}
        color1={dark ? "#2FD3F2" : "#2563EB"}
        color2={dark ? "#7B61FF" : "#8B5CF6"}
        speed={58}
        size={108}
        angle={-180}
        hover={125}
        reach={300}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          minWidth: 0,
          minHeight: 0,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/10 dark:from-black/5 dark:to-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,transparent_42%,rgba(3,7,18,0.08)_100%)] dark:bg-[radial-gradient(circle_at_50%_35%,transparent_0%,transparent_38%,rgba(0,0,0,0.30)_100%)]" />
    </div>
  );
}
