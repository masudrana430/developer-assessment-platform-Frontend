"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  ready: boolean;
  syncTheme: (theme: Theme) => void;
}>({
  theme: "light",
  ready: false,
  syncTheme: () => undefined,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dap_theme") as Theme | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const next = stored ?? (prefersDark ? "dark" : "light");

    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setReady(true);
  }, []);

  function syncTheme(next: Theme) {
    setTheme(next);
    localStorage.setItem("dap_theme", next);
  }

  return (
    <ThemeContext.Provider value={{ theme, ready, syncTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle() {
  const { theme, ready, syncTheme } = useTheme();

  return (
    <AnimatedThemeToggler
      variant="hexagon"
      theme={theme}
      onThemeChange={syncTheme}
      disabled={!ready}
      className="group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] transition duration-200 hover:scale-105 hover:bg-[var(--muted-bg)] active:scale-95 disabled:pointer-events-none disabled:opacity-60 [&_svg]:h-[18px] [&_svg]:w-[18px]"
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      title={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
    />
  );
}
