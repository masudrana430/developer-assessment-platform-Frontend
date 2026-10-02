"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { gsap } from "gsap";
import { ThemeToggle } from "@/components/theme-provider";
import "./mobile-staggered-menu.css";

export type MobileStaggeredMenuItem = {
  href: string;
  label: string;
  active?: boolean;
};

type MobileStaggeredMenuProps = {
  items: MobileStaggeredMenuItem[];
  authenticated: boolean;
  onLogout: () => void | Promise<void>;
};

export default function MobileStaggeredMenu({
  items,
  authenticated,
  onLogout,
}: MobileStaggeredMenuProps) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef<HTMLElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  const [textLines, setTextLines] = useState(["Menu", "Close"]);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const busyRef = useRef(false);

  const colors = ["#bfdbfe", "#60a5fa", "#2563eb"];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      const preLayers = preContainer
        ? Array.from(preContainer.querySelectorAll<HTMLElement>(".mobile-sm__prelayer"))
        : [];

      preLayerElsRef.current = preLayers;

      gsap.set([panel, ...preLayers], { xPercent: 100, opacity: 1 });
      if (preContainer) {
        gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      }

      gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(textInner, { yPercent: 0 });
    });

    return () => ctx.revert();
  }, []);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;

    const itemEls = Array.from(
      panel.querySelectorAll<HTMLElement>(".mobile-sm__item-label"),
    );
    const numberEls = Array.from(
      panel.querySelectorAll<HTMLElement>(
        ".mobile-sm__list[data-numbering] .mobile-sm__item",
      ),
    );
    const footerTitle = panel.querySelector<HTMLElement>(".mobile-sm__footer-title");
    const footerActions = Array.from(
      panel.querySelectorAll<HTMLElement>(".mobile-sm__footer-action"),
    );

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    }
    if (numberEls.length) {
      gsap.set(
        numberEls,
        { "--sm-num-opacity": 0 } as unknown as gsap.TweenVars,
      );
    }
    if (footerTitle) {
      gsap.set(footerTitle, { opacity: 0 });
    }
    if (footerActions.length) {
      gsap.set(footerActions, { y: 25, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    layers.forEach((layer, index) => {
      tl.fromTo(
        layer,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        index * 0.07,
      );
    });

    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: 100 },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime,
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart,
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" },
          } as unknown as gsap.TweenVars,
          itemsStart + 0.1,
        );
      }
    }

    if (footerTitle || footerActions.length) {
      const footerStart = panelInsertTime + panelDuration * 0.4;

      if (footerTitle) {
        tl.to(
          footerTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          footerStart,
        );
      }

      if (footerActions.length) {
        tl.to(
          footerActions,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
          },
          footerStart + 0.04,
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;

    const timeline = buildOpenTimeline();

    if (!timeline) {
      busyRef.current = false;
      return;
    }

    timeline.eventCallback("onComplete", () => {
      busyRef.current = false;
    });
    timeline.play(0);
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    closeTweenRef.current?.kill();

    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: 100,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(
          panel.querySelectorAll<HTMLElement>(".mobile-sm__item-label"),
        );
        const numberEls = Array.from(
          panel.querySelectorAll<HTMLElement>(
            ".mobile-sm__list[data-numbering] .mobile-sm__item",
          ),
        );
        const footerTitle =
          panel.querySelector<HTMLElement>(".mobile-sm__footer-title");
        const footerActions = Array.from(
          panel.querySelectorAll<HTMLElement>(".mobile-sm__footer-action"),
        );

        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        }
        if (numberEls.length) {
          gsap.set(
            numberEls,
            { "--sm-num-opacity": 0 } as unknown as gsap.TweenVars,
          );
        }
        if (footerTitle) {
          gsap.set(footerTitle, { opacity: 0 });
        }
        if (footerActions.length) {
          gsap.set(footerActions, { y: 25, opacity: 0 });
        }

        busyRef.current = false;
      },
    });
  }, []);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    if (!icon) return;

    spinTweenRef.current?.kill();
    spinTweenRef.current = gsap.to(icon, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? "power4.out" : "power3.inOut",
      overwrite: "auto",
    });
  }, []);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const cycles = 3;
    const sequence = [currentLabel];

    let last = currentLabel;
    for (let index = 0; index < cycles; index += 1) {
      last = last === "Menu" ? "Close" : "Menu";
      sequence.push(last);
    }

    if (last !== targetLabel) sequence.push(targetLabel);
    sequence.push(targetLabel);

    setTextLines(sequence);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = sequence.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out",
    });
  }, []);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;

    openRef.current = false;
    setOpen(false);
    playClose();
    animateIcon(false);
    animateText(false);
  }, [animateIcon, animateText, playClose]);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      playOpen();
    } else {
      playClose();
    }

    animateIcon(target);
    animateText(target);
  }, [animateIcon, animateText, playClose, playOpen]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu, open]);

  useEffect(() => {
    return () => {
      openTlRef.current?.kill();
      closeTweenRef.current?.kill();
      spinTweenRef.current?.kill();
      textCycleAnimRef.current?.kill();
    };
  }, []);

  const accentStyle = {
    "--sm-accent": "#2563eb",
  } as CSSProperties;

  const layerColors = (() => {
    const raw = colors.slice(0, 4);
    const output = [...raw];

    if (output.length >= 3) {
      const middle = Math.floor(output.length / 2);
      output.splice(middle, 1);
    }

    return output;
  })();

  return (
    <>
      <div className="h-16 lg:hidden" aria-hidden="true" />

      <div
        className="mobile-staggered-menu"
        style={accentStyle}
        data-position="right"
        data-open={open || undefined}
      >
        <div ref={preLayersRef} className="mobile-sm__prelayers" aria-hidden="true">
          {layerColors.map((color) => (
            <div
              key={color}
              className="mobile-sm__prelayer"
              style={{ background: color }}
            />
          ))}
        </div>

        <header className="mobile-sm__header" aria-label="Mobile navigation header">
          <Link
            href="/"
            onClick={closeMenu}
            className="mobile-sm__brand"
            aria-label="DevAssess home"
          >
            <span className="mobile-sm__brand-mark">DA</span>
            <span className="mobile-sm__brand-name">DevAssess</span>
          </Link>

          <div className="mobile-sm__header-actions">
            <div className="mobile-sm__theme">
              <ThemeToggle />
            </div>

            <button
              ref={toggleBtnRef}
              className="mobile-sm__toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-staggered-menu-panel"
              onClick={toggleMenu}
              type="button"
            >
              <span className="mobile-sm__toggle-text-wrap" aria-hidden="true">
                <span ref={textInnerRef} className="mobile-sm__toggle-text-inner">
                  {textLines.map((line, index) => (
                    <span className="mobile-sm__toggle-line" key={index}>
                      {line}
                    </span>
                  ))}
                </span>
              </span>

              <span ref={iconRef} className="mobile-sm__icon" aria-hidden="true">
                <span ref={plusHRef} className="mobile-sm__icon-line" />
                <span
                  ref={plusVRef}
                  className="mobile-sm__icon-line mobile-sm__icon-line-v"
                />
              </span>
            </button>
          </div>
        </header>

        <aside
          id="mobile-staggered-menu-panel"
          ref={panelRef}
          className="mobile-sm__panel"
          aria-hidden={!open}
        >
          <div className="mobile-sm__panel-inner">
            <ul
              className="mobile-sm__list"
              role="list"
              data-numbering
            >
              {items.map((item, index) => (
                <li className="mobile-sm__item-wrap" key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={item.active ? "page" : undefined}
                    className={[
                      "mobile-sm__item",
                      item.active ? "mobile-sm__item--active" : "",
                    ].join(" ")}
                    data-index={index + 1}
                  >
                    <span className="mobile-sm__item-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mobile-sm__footer" aria-label="Account actions">
              <h3 className="mobile-sm__footer-title">Account</h3>

              <div className="mobile-sm__footer-actions">
                {!authenticated ? (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="mobile-sm__footer-action"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="mobile-sm__footer-action mobile-sm__footer-action--primary"
                    >
                      Create account
                    </Link>
                  </>
                ) : (
                  <button
                    type="button"
                    className="mobile-sm__footer-action"
                    onClick={() => {
                      closeMenu();
                      void onLogout();
                    }}
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
