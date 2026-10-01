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

  const panelRef = useRef<HTMLElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const plusHRef = useRef<HTMLSpanElement>(null);
  const plusVRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const textInnerRef = useRef<HTMLSpanElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

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
        ? Array.from(
            preContainer.querySelectorAll<HTMLElement>(
              ".mobile-staggered-menu__prelayer",
            ),
          )
        : [];

      preLayerElsRef.current = preLayers;

      const offscreen = 100;
      gsap.set([panel, ...preLayers], {
        xPercent: offscreen,
        opacity: 1,
      });

      if (preContainer) {
        gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      }

      gsap.set(plusH, {
        transformOrigin: "50% 50%",
        rotate: 0,
      });
      gsap.set(plusV, {
        transformOrigin: "50% 50%",
        rotate: 90,
      });
      gsap.set(icon, {
        rotate: 0,
        transformOrigin: "50% 50%",
      });
      gsap.set(textInner, { yPercent: 0 });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();

    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemEls = Array.from(
      panel.querySelectorAll<HTMLElement>(
        ".mobile-staggered-menu__item-label",
      ),
    );
    const numberEls = Array.from(
      panel.querySelectorAll<HTMLElement>(
        ".mobile-staggered-menu__list[data-numbering] .mobile-staggered-menu__item",
      ),
    );
    const footerLabel = panel.querySelector<HTMLElement>(
      ".mobile-staggered-menu__footer-label",
    );
    const footerActions = Array.from(
      panel.querySelectorAll<HTMLElement>(
        ".mobile-staggered-menu__footer-link, .mobile-staggered-menu__footer-button",
      ),
    );

    const offscreen = 100;
    const layerStates = layers.map((element) => ({
      element,
      start: offscreen,
    }));

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    }

    if (numberEls.length) {
      gsap.set(numberEls, { "--sm-num-opacity": 0 });
    }

    if (footerLabel) {
      gsap.set(footerLabel, { opacity: 0 });
    }

    if (footerActions.length) {
      gsap.set(footerActions, { y: 25, opacity: 0 });
    }

    const timeline = gsap.timeline({ paused: true });

    layerStates.forEach((layerState, index) => {
      timeline.fromTo(
        layerState.element,
        { xPercent: layerState.start },
        {
          xPercent: 0,
          duration: 0.5,
          ease: "power4.out",
        },
        index * 0.07,
      );
    });

    const lastTime = layerStates.length
      ? (layerStates.length - 1) * 0.07
      : 0;
    const panelInsertTime =
      lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    timeline.fromTo(
      panel,
      { xPercent: offscreen },
      {
        xPercent: 0,
        duration: panelDuration,
        ease: "power4.out",
      },
      panelInsertTime,
    );

    if (itemEls.length) {
      const itemsStart =
        panelInsertTime + panelDuration * 0.15;

      timeline.to(
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
        timeline.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1,
        );
      }
    }

    const footerStart =
      panelInsertTime + panelDuration * 0.4;

    if (footerLabel) {
      timeline.to(
        footerLabel,
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        footerStart,
      );
    }

    if (footerActions.length) {
      timeline.to(
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

    openTlRef.current = timeline;
    return timeline;
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

    const offscreen = 100;

    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(
          panel.querySelectorAll<HTMLElement>(
            ".mobile-staggered-menu__item-label",
          ),
        );
        const numberEls = Array.from(
          panel.querySelectorAll<HTMLElement>(
            ".mobile-staggered-menu__list[data-numbering] .mobile-staggered-menu__item",
          ),
        );
        const footerLabel = panel.querySelector<HTMLElement>(
          ".mobile-staggered-menu__footer-label",
        );
        const footerActions = Array.from(
          panel.querySelectorAll<HTMLElement>(
            ".mobile-staggered-menu__footer-link, .mobile-staggered-menu__footer-button",
          ),
        );

        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        }

        if (numberEls.length) {
          gsap.set(numberEls, { "--sm-num-opacity": 0 });
        }

        if (footerLabel) {
          gsap.set(footerLabel, { opacity: 0 });
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
    const sequence = [currentLabel];
    let last = currentLabel;

    for (let index = 0; index < 3; index += 1) {
      last = last === "Menu" ? "Close" : "Menu";
      sequence.push(last);
    }

    if (last !== targetLabel) {
      sequence.push(targetLabel);
    }

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
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
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

  const rawColors = colors.slice(0, 4);
  const layerColors = [...rawColors];

  if (layerColors.length >= 3) {
    layerColors.splice(Math.floor(layerColors.length / 2), 1);
  }

  return (
    <div
      className="mobile-staggered-menu"
      data-open={open || undefined}
      data-position="right"
      style={accentStyle}
    >
      <div
        ref={preLayersRef}
        className="mobile-staggered-menu__prelayers"
        aria-hidden="true"
      >
        {layerColors.map((color) => (
          <div
            key={color}
            className="mobile-staggered-menu__prelayer"
            style={{ background: color }}
          />
        ))}
      </div>

      <header
        className="mobile-staggered-menu__header"
        aria-label="Mobile navigation header"
      >
        <Link
          href="/"
          className="mobile-staggered-menu__brand"
          onClick={closeMenu}
        >
          <span className="mobile-staggered-menu__brand-mark">
            DA
          </span>
          <span>DevAssess</span>
        </Link>

        <div className="mobile-staggered-menu__actions">
          <div className="mobile-staggered-menu__theme">
            <ThemeToggle />
          </div>

          <button
            ref={toggleBtnRef}
            className="mobile-staggered-menu__toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span
              className="mobile-staggered-menu__toggle-text-wrap"
              aria-hidden="true"
            >
              <span
                ref={textInnerRef}
                className="mobile-staggered-menu__toggle-text-inner"
              >
                {textLines.map((line, index) => (
                  <span
                    className="mobile-staggered-menu__toggle-line"
                    key={line + index}
                  >
                    {line}
                  </span>
                ))}
              </span>
            </span>

            <span
              ref={iconRef}
              className="mobile-staggered-menu__icon"
              aria-hidden="true"
            >
              <span
                ref={plusHRef}
                className="mobile-staggered-menu__icon-line"
              />
              <span
                ref={plusVRef}
                className="mobile-staggered-menu__icon-line"
              />
            </span>
          </button>
        </div>
      </header>

      <aside
        id="mobile-staggered-menu-panel"
        ref={panelRef}
        className="mobile-staggered-menu__panel"
        aria-hidden={!open}
      >
        <div className="mobile-staggered-menu__panel-inner">
          <ul
            className="mobile-staggered-menu__list"
            role="list"
            data-numbering
          >
            {items.map((item) => (
              <li
                className="mobile-staggered-menu__item-wrap"
                key={item.href}
              >
                <Link
                  href={item.href}
                  className="mobile-staggered-menu__item"
                  aria-current={item.active ? "page" : undefined}
                  onClick={closeMenu}
                >
                  <span className="mobile-staggered-menu__item-label">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mobile-staggered-menu__footer">
            <p className="mobile-staggered-menu__footer-label">
              Account
            </p>

            <div className="mobile-staggered-menu__footer-actions">
              {!authenticated ? (
                <>
                  <Link
                    href="/login"
                    className="mobile-staggered-menu__footer-link"
                    onClick={closeMenu}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="mobile-staggered-menu__footer-link mobile-staggered-menu__footer-link--primary"
                    onClick={closeMenu}
                  >
                    Create account
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  className="mobile-staggered-menu__footer-button"
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
  );
}
