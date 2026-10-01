"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

type ThemeMorphOrigin = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ViewTransitionLike = {
  ready: Promise<void>;
  finished: Promise<void>;
};

type DocumentWithViewTransition = Document & {
  startViewTransition?: (update: () => void) => ViewTransitionLike;
};

const ThemeContext = createContext<{
  theme: Theme;
  ready: boolean;
  toggleTheme: (origin?: ThemeMorphOrigin) => void;
}>({
  theme: "light",
  ready: false,
  toggleTheme: () => undefined,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dap_theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = stored ?? (prefersDark ? "dark" : "light");

    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setReady(true);
  }, []);

  function applyTheme(next: Theme) {
    flushSync(() => setTheme(next));
    localStorage.setItem("dap_theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  function toggleTheme(origin?: ThemeMorphOrigin) {
    const next = theme === "dark" ? "light" : "dark";
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const doc = document as DocumentWithViewTransition;

    if (!doc.startViewTransition || reducedMotion || !origin) {
      applyTheme(next);
      return;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const left = Math.max(0, origin.x - origin.width / 2);
    const top = Math.max(0, origin.y - origin.height / 2);
    const right = Math.max(
      0,
      viewportWidth - (origin.x + origin.width / 2),
    );
    const bottom = Math.max(
      0,
      viewportHeight - (origin.y + origin.height / 2),
    );

    const transition = doc.startViewTransition(() => {
      applyTheme(next);
    });

    void transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `inset(${top}px ${right}px ${bottom}px ${left}px round 999px)`,
            "inset(0px 0px 0px 0px round 0px)",
          ],
        },
        {
          duration: 620,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
          pseudoElement: "::view-transition-new(root)",
        } as KeyframeAnimationOptions & { pseudoElement: string },
      );
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, ready, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle() {
  const { theme, ready, toggleTheme } = useTheme();

  function handleToggle(event: ReactMouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    toggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={!ready}
      className="group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] transition duration-200 hover:scale-105 hover:bg-[var(--muted-bg)] active:scale-95 disabled:pointer-events-none disabled:opacity-60"
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      title={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
    >
      <Sun
        size={18}
        aria-hidden="true"
        className={[
          "absolute transition-all duration-300 ease-out",
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0",
        ].join(" ")}
      />
      <Moon
        size={18}
        aria-hidden="true"
        className={[
          "absolute transition-all duration-300 ease-out",
          theme === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0",
        ].join(" ")}
      />
    </button>
  );
}
