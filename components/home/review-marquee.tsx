"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

type MarqueeProps = ComponentPropsWithoutRef<"div"> & {
  reverse?: boolean;
  children: ReactNode;
  vertical?: boolean;
  ariaLabel?: string;
  ariaLive?: "off" | "polite" | "assertive";
};

export function Marquee({
  className = "",
  reverse = false,
  children,
  vertical = false,
  ariaLabel,
  ariaLive = "off",
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={[
        "relative flex overflow-hidden p-2 [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className,
      ].join(" ")}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role="region"
    >
      <div
        className={[
          "review-marquee-rail flex shrink-0 [gap:var(--gap)]",
          vertical ? "flex-col" : "flex-row",
          vertical ? "review-marquee-vertical" : "review-marquee-horizontal",
          reverse ? "[animation-direction:reverse]" : "",
        ].join(" ")}
      >
        <div className={["flex shrink-0 [gap:var(--gap)]", vertical ? "flex-col" : "flex-row"].join(" ")}>
          {children}
        </div>
        <div
          aria-hidden="true"
          className={["flex shrink-0 [gap:var(--gap)]", vertical ? "flex-col" : "flex-row"].join(" ")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    name: "Ava Green",
    username: "@ava",
    body: "The assessment flow feels clear from enrollment all the way through submission.",
    img: "https://cdn.21st.dev/assets/mirror/55/55cf6231499bcdc496f15ff1d28d4170ac9b99e9279495caa44fca70886d8b2e.jpg",
    country: "🇦🇺 Australia",
  },
  {
    name: "Ana Miller",
    username: "@ana",
    body: "The timed attempt experience is focused and easy to follow.",
    img: "https://cdn.21st.dev/assets/mirror/f0/f07b84f12ef125cbb837a7bd64da401992f5f62bd55fee10d01cd3dcc8abae80.jpg",
    country: "🇩🇪 Germany",
  },
  {
    name: "Mateo Rossi",
    username: "@mat",
    body: "Reviewer workflows feel structured instead of cluttered.",
    img: "https://cdn.21st.dev/assets/mirror/7c/7c0d2aa99715b15c218385f5679347782843c02f939d8eee6f9cb1cad6ba6ed0.jpg",
    country: "🇮🇹 Italy",
  },
  {
    name: "Maya Patel",
    username: "@maya",
    body: "Role-based navigation makes the platform easy to understand.",
    img: "https://cdn.21st.dev/assets/mirror/f8/f8f2ddc445b6b2318430260bdebb665c9415865827230565aa42f57c9c794baf.jpg",
    country: "🇮🇳 India",
  },
  {
    name: "Noah Smith",
    username: "@noah",
    body: "The checkout-to-attempt handoff feels clean and predictable.",
    img: "https://cdn.21st.dev/assets/mirror/ae/ae1d49872fdd6f8d9aa933f6ca8bce8cb1ba7e87dfb9d2926661184cb7bfe26d.jpg",
    country: "🇺🇸 USA",
  },
  {
    name: "Lucas Stone",
    username: "@luc",
    body: "The interface stays responsive even across the more complex flows.",
    img: "https://cdn.21st.dev/assets/mirror/9a/9aac54d62e727561f6958213b8a3649230a3bba61ba5ddf63c69d3c6e4aecb0a.jpg",
    country: "🇫🇷 France",
  },
  {
    name: "Haruto Sato",
    username: "@haru",
    body: "The mobile experience still feels intentional and usable.",
    img: "https://cdn.21st.dev/assets/mirror/e5/e55f3cdab57eb4084f7006cfe9f7f047e638e1b257a53498aaed14b83087152a.jpg",
    country: "🇯🇵 Japan",
  },
  {
    name: "Emma Lee",
    username: "@emma",
    body: "The review and feedback states make the result journey easy to follow.",
    img: "https://cdn.21st.dev/assets/mirror/03/03410c155320ba33ecb8d798807c6c9610f33b2b2acdd4ed961a68185806df79.jpg",
    country: "🇨🇦 Canada",
  },
  {
    name: "Carlos Ray",
    username: "@carl",
    body: "The visual hierarchy keeps the platform feeling calm and professional.",
    img: "https://cdn.21st.dev/assets/mirror/b5/b58616f0d669595c9a42d60a0b9803364c9859f1c3db93a5e3dc408b603e03e8.jpg",
    country: "🇪🇸 Spain",
  },
];

function TestimonialCard({ img, name, username, body, country }: (typeof testimonials)[number]) {
  return (
    <article className="review-testimonial-card w-52 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-[1.015] hover:border-blue-300/80 hover:shadow-[0_20px_55px_rgba(37,99,235,0.16)] dark:border-white/10 dark:bg-slate-900/90 dark:hover:border-cyan-300/30 dark:hover:shadow-[0_20px_55px_rgba(34,211,238,0.12)] sm:w-56">
      <div className="flex items-center gap-2.5">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-md dark:ring-slate-700">
          <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>

        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
            <span className="truncate">{name}</span>
            <span className="text-xs">{country}</span>
          </p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{username}</p>
        </div>
      </div>

      <blockquote className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
        “{body}”
      </blockquote>
    </article>
  );
}

export default function ReviewMarquee() {
  const reversed = [...testimonials].reverse();

  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-[980px] items-center justify-center overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-white [perspective:300px] shadow-[0_24px_80px_rgba(37,99,235,0.08)] dark:bg-[#091221] dark:shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:h-[460px]">
      <div
        className="absolute left-1/2 top-1/2 flex w-[1120px] items-center gap-4"
        style={{
          transform:
            "translate(-50%, -50%) translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <Marquee
          vertical
          className="h-[720px] [--duration:18s]"
          ariaLabel="Testimonials column one"
        >
          {testimonials.map((review) => (
            <TestimonialCard key={`one-${review.username}`} {...review} />
          ))}
        </Marquee>

        <Marquee
          vertical
          reverse
          className="h-[720px] [--duration:22s]"
          ariaLabel="Testimonials column two"
        >
          {reversed.map((review) => (
            <TestimonialCard key={`two-${review.username}`} {...review} />
          ))}
        </Marquee>

        <Marquee
          vertical
          className="hidden h-[720px] [--duration:20s] sm:flex"
          ariaLabel="Testimonials column three"
        >
          {testimonials.map((review) => (
            <TestimonialCard key={`three-${review.username}`} {...review} />
          ))}
        </Marquee>

        <Marquee
          vertical
          reverse
          className="hidden h-[720px] [--duration:24s] lg:flex"
          ariaLabel="Testimonials column four"
        >
          {reversed.map((review) => (
            <TestimonialCard key={`four-${review.username}`} {...review} />
          ))}
        </Marquee>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white via-white/90 to-transparent dark:from-[#091221] dark:via-[#091221]/92" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#091221] dark:via-[#091221]/92" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-[#091221] dark:via-[#091221]/92" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-[#091221] dark:via-[#091221]/92" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.07),transparent_55%)]" />
    </div>
  );
}
