"use client";

import Link from "next/link";
import { ArrowRight, UsersRound } from "lucide-react";
import Gravity, {
  MatterBody,
} from "@/components/fancy/physics/cursor-attractor-and-gravity";
import useScreenSize from "@/hooks/use-screen-size";
import GlowCursor from "@/components/reactbits/glow-cursor/GlowCursor";
import { useTheme } from "@/components/theme-provider";

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export default function CommunityScene() {
  const screenSize = useScreenSize();
  const { theme } = useTheme();

  const getImageCount = () => {
    if (screenSize.lessThan("sm")) return 50;
    if (screenSize.lessThan("md")) return 60;
    if (screenSize.lessThan("lg")) return 70;
    return 80;
  };

  const getMaxSize = () => {
    if (screenSize.lessThan("sm")) return 40;
    if (screenSize.lessThan("md")) return 50;
    return 60;
  };

  const getMinSize = () => {
    if (screenSize.lessThan("sm")) return 16;
    if (screenSize.lessThan("md")) return 20;
    return 22;
  };

  const count = getImageCount();
  const minSize = getMinSize();
  const maxSize = getMaxSize();

  return (
    <main className="relative min-h-[calc(100vh-65px)] overflow-hidden bg-white dark:bg-[#07111f]">
      <GlowCursor
        className="min-h-[calc(100vh-65px)]"
        color="#67E8F9"
        secondaryColor="#A78BFA"
        trailLength={screenSize.lessThan("sm") ? 28 : 40}
        trailWidth={screenSize.lessThan("sm") ? 6 : 8}
        trailTaper={0.8}
        followSpeed={0.16}
        glowIntensity={1.9}
        glowSpread={1.2}
        hotspot={0.65}
        brightness={1.25}
        opacity={theme === "dark" ? 1 : 0.72}
        pulseSpeed={1.1}
        noiseStrength={0.035}
        idleFade
        idleTimeout={700}
        fadeDuration={900}
        blendMode={theme === "dark" ? "screen" : "normal"}
        maxDevicePixelRatio={1.5}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_48%,rgba(37,99,235,0.11),transparent_32%),radial-gradient(circle_at_76%_35%,rgba(34,211,238,0.09),transparent_28%)] dark:bg-[radial-gradient(circle_at_28%_48%,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_76%_35%,rgba(34,211,238,0.10),transparent_30%)]" />

        <div className="relative min-h-[calc(100vh-65px)]">
        <Gravity
          attractorPoint={{
            x: screenSize.lessThan("md") ? "50%" : "33%",
            y: screenSize.lessThan("md") ? "58%" : "50%",
          }}
          attractorStrength={0.0005}
          cursorStrength={-0.004}
          cursorFieldRadius={screenSize.lessThan("sm") ? 100 : 200}
          resetOnResize={false}
          className="z-10"
        >
          {Array.from({ length: count }, (_, i) => {
            const size =
              minSize + seeded(i, 1) * Math.max(1, maxSize - minSize);
            const x = seeded(i, 2) * 100;
            const y = seeded(i, 3) * 30;
            const gender = i % 2 === 0 ? "men" : "women";
            const portraitIndex = i % 100;

            return (
              <MatterBody
                key={count + "-" + i}
                matterBodyOptions={{
                  friction: 0.5,
                  frictionAir: 0.018,
                  restitution: 0.2,
                  density: 0.001,
                }}
                x={x + "%"}
                y={y + "%"}
                angle={(seeded(i, 4) - 0.5) * 18}
              >
                <img
                  src={
                    "https://randomuser.me/api/portraits/" +
                    gender +
                    "/" +
                    portraitIndex +
                    ".jpg"
                  }
                  alt=""
                  loading="lazy"
                  draggable={false}
                  className="rounded-full border-2 border-white object-cover shadow-[0_8px_28px_rgba(15,23,42,0.16)] ring-1 ring-blue-100/70 select-none dark:border-slate-800 dark:ring-white/10"
                  style={{
                    width: size + "px",
                    height: size + "px",
                  }}
                />
              </MatterBody>
            );
          })}
        </Gravity>

        <section className="pointer-events-none relative z-30 mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-start justify-center px-5 pb-16 pt-16 sm:px-8 md:items-center md:justify-end md:pt-0 lg:px-12">
          <div className="pointer-events-auto w-full max-w-xl rounded-[2rem] border border-white/80 bg-white/72 p-7 shadow-2xl shadow-blue-200/30 backdrop-blur-2xl dark:border-white/15 dark:bg-slate-950/55 dark:shadow-black/25 sm:p-9 md:mr-6 lg:mr-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-700 dark:border-cyan-100/15 dark:bg-white/[0.07] dark:text-cyan-100">
              <UsersRound size={14} />
              DevAssess Community
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Join the{" "}
              <span className="italic text-blue-600 dark:text-cyan-200">
                community
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Connect with candidates, reviewers and builders exploring better
              developer assessment workflows. Move your cursor through the
              community and watch the network react.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]"
              >
                Join the community <ArrowRight size={17} />
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-white/75 px-5 py-3 text-sm font-semibold text-slate-800 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.10]"
              >
                Learn about DevAssess
              </Link>
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Move your cursor near the avatars
            </p>
          </div>
        </section>
        </div>
      </GlowCursor>
    </main>
  );
}
