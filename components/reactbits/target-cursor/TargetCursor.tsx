"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

const getContainingBlock = (
  element: HTMLElement | null,
): HTMLElement | null => {
  let node = element?.parentElement ?? null;

  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);

    if (
      style.transform !== "none" ||
      style.perspective !== "none" ||
      style.filter !== "none" ||
      style.willChange.includes("transform") ||
      style.willChange.includes("perspective") ||
      style.willChange.includes("filter") ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }

    node = node.parentElement;
  }

  return null;
};

const getContainingBlockOffset = (
  block: HTMLElement | null,
): { x: number; y: number } => {
  if (!block) return { x: 0, y: 0 };

  const rect = block.getBoundingClientRect();
  return {
    x: rect.left + block.clientLeft,
    y: rect.top + block.clientTop,
  };
};

export interface TargetCursorProps {
  targetSelector?: string;
  scopeSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  cursorColor?: string;
  cursorColorOnTarget?: string;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = ".cursor-target",
  scopeSelector,
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = "#ffffff",
  cursorColorOnTarget,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const containingBlockRef = useRef<HTMLElement | null>(null);

  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef<
    { x: number; y: number }[] | null
  >(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;

    const hasTouchScreen =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileRegex =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());

    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const constants = useMemo(
    () => ({ borderWidth: 3, cornerSize: 12 }),
    [],
  );

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;

    const { x: offsetX, y: offsetY } = getContainingBlockOffset(
      containingBlockRef.current,
    );

    gsap.to(cursorRef.current, {
      x: x - offsetX,
      y: y - offsetY,
      duration: 0.1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const cursor = cursorRef.current;
    const scope = scopeSelector
      ? document.querySelector<HTMLElement>(scopeSelector)
      : null;

    if (scopeSelector && !scope) return;

    const originalScopeCursor = scope?.style.cursor ?? "";
    const originalBodyCursor = document.body.style.cursor;

    if (hideDefaultCursor) {
      if (scope) {
        scope.style.cursor = "none";
      } else {
        document.body.style.cursor = "none";
      }
    }

    cornersRef.current =
      cursor.querySelectorAll<HTMLDivElement>(".target-cursor-corner");

    containingBlockRef.current = getContainingBlock(cursor);
    const getOffset = () =>
      getContainingBlockOffset(containingBlockRef.current);

    let activeTarget: Element | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

    gsap.set(cursor, {
      opacity: scope ? 0 : 1,
      xPercent: -50,
      yPercent: -50,
    });

    const showCursor = () => {
      gsap.to(cursor, {
        opacity: 1,
        duration: 0.12,
        overwrite: "auto",
      });
    };

    const hideCursor = () => {
      gsap.to(cursor, {
        opacity: 0,
        duration: 0.12,
        overwrite: "auto",
      });
    };

    if (scope) {
      scope.addEventListener("mouseenter", showCursor);
      scope.addEventListener("mouseleave", hideCursor);
    }

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener("mouseleave", currentLeaveHandler);
      }

      currentLeaveHandler = null;
    };

    const initialOffset = getOffset();
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y,
    });

    const createSpinTimeline = () => {
      spinTl.current?.kill();

      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, {
          rotation: "+=360",
          duration: spinDuration,
          ease: "none",
        });
    };

    createSpinTimeline();

    const tickerFn = () => {
      if (
        !targetCornerPositionsRef.current ||
        !cursorRef.current ||
        !cornersRef.current
      ) {
        return;
      }

      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(
        cursorRef.current,
        "x",
      ) as number;
      const cursorY = gsap.getProperty(
        cursorRef.current,
        "y",
      ) as number;
      const corners = Array.from(cornersRef.current);

      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, "x") as number;
        const currentY = gsap.getProperty(corner, "y") as number;
        const targetX =
          targetCornerPositionsRef.current![i].x - cursorX;
        const targetY =
          targetCornerPositionsRef.current![i].y - cursorY;
        const finalX =
          currentX + (targetX - currentX) * strength;
        const finalY =
          currentY + (targetY - currentY) * strength;
        const duration =
          strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration,
          ease: duration === 0 ? "none" : "power1.out",
          overwrite: "auto",
        });
      });
    };

    tickerFnRef.current = tickerFn;

    const moveHandler = (event: MouseEvent) => {
      if (scope) {
        const rect = scope.getBoundingClientRect();
        const inside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (!inside) return;
      }

      moveCursor(event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", moveHandler);

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;

      const { x: offsetX, y: offsetY } = getOffset();
      const mouseX =
        (gsap.getProperty(cursorRef.current, "x") as number) +
        offsetX;
      const mouseY =
        (gsap.getProperty(cursorRef.current, "y") as number) +
        offsetY;
      const elementUnderMouse = document.elementFromPoint(
        mouseX,
        mouseY,
      );
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget ||
          elementUnderMouse.closest(targetSelector) ===
            activeTarget);

      if (!isStillOverTarget) {
        currentLeaveHandler?.();
      }
    };

    window.addEventListener("scroll", scrollHandler, {
      passive: true,
    });

    const mouseDownHandler = () => {
      if (!dotRef.current) return;

      gsap.to(dotRef.current, {
        scale: 0.7,
        duration: 0.3,
      });
      gsap.to(cursorRef.current, {
        scale: 0.9,
        duration: 0.2,
      });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) return;

      gsap.to(dotRef.current, {
        scale: 1,
        duration: 0.3,
      });
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.2,
      });
    };

    window.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);

    const enterHandler = (event: MouseEvent) => {
      const directTarget = event.target as Element;

      if (scope && !scope.contains(directTarget)) return;

      const allTargets: Element[] = [];
      let current: Element | null = directTarget;

      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          allTargets.push(current);
        }

        if (scope && current === scope) break;
        current = current.parentElement;
      }

      const target = allTargets[0] || null;

      if (
        !target ||
        !cursorRef.current ||
        !cornersRef.current
      ) {
        return;
      }

      if (activeTarget === target) return;

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);

      corners.forEach((corner) =>
        gsap.killTweensOf(corner, "x,y"),
      );
      gsap.killTweensOf(cursorRef.current, "rotation");
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      if (cursorColorOnTarget) {
        gsap.to(corners, {
          borderColor: cursorColorOnTarget,
          duration: 0.15,
          ease: "power2.out",
        });

        if (dotRef.current) {
          gsap.to(dotRef.current, {
            backgroundColor: cursorColorOnTarget,
            duration: 0.15,
            ease: "power2.out",
          });
        }
      }

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const { x: offsetX, y: offsetY } = getOffset();
      const cursorX = gsap.getProperty(
        cursorRef.current,
        "x",
      ) as number;
      const cursorY = gsap.getProperty(
        cursorRef.current,
        "y",
      ) as number;

      targetCornerPositionsRef.current = [
        {
          x: rect.left - borderWidth - offsetX,
          y: rect.top - borderWidth - offsetY,
        },
        {
          x:
            rect.right +
            borderWidth -
            cornerSize -
            offsetX,
          y: rect.top - borderWidth - offsetY,
        },
        {
          x:
            rect.right +
            borderWidth -
            cornerSize -
            offsetX,
          y:
            rect.bottom +
            borderWidth -
            cornerSize -
            offsetY,
        },
        {
          x: rect.left - borderWidth - offsetX,
          y:
            rect.bottom +
            borderWidth -
            cornerSize -
            offsetY,
        },
      ];

      isActiveRef.current = true;
      gsap.ticker.add(tickerFnRef.current!);

      gsap.to(activeStrengthRef.current, {
        current: 1,
        duration: hoverDuration,
        ease: "power2.out",
      });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x:
            targetCornerPositionsRef.current![i].x -
            cursorX,
          y:
            targetCornerPositionsRef.current![i].y -
            cursorY,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFnRef.current!);
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef.current, {
          current: 0,
          overwrite: true,
        });
        activeTarget = null;

        if (
          cursorColorOnTarget &&
          cornersRef.current
        ) {
          gsap.to(Array.from(cornersRef.current), {
            borderColor: cursorColor,
            duration: 0.15,
            ease: "power2.out",
          });

          if (dotRef.current) {
            gsap.to(dotRef.current, {
              backgroundColor: cursorColor,
              duration: 0.15,
              ease: "power2.out",
            });
          }
        }

        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current);
          gsap.killTweensOf(corners, "x,y");

          const { cornerSize } = constants;
          const positions = [
            {
              x: -cornerSize * 1.5,
              y: -cornerSize * 1.5,
            },
            {
              x: cornerSize * 0.5,
              y: -cornerSize * 1.5,
            },
            {
              x: cornerSize * 0.5,
              y: cornerSize * 0.5,
            },
            {
              x: -cornerSize * 1.5,
              y: cornerSize * 0.5,
            },
          ];

          const tl = gsap.timeline();
          corners.forEach((corner, index) => {
            tl.to(
              corner,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.3,
                ease: "power3.out",
              },
              0,
            );
          });
        }

        resumeTimeout = setTimeout(() => {
          if (
            !activeTarget &&
            cursorRef.current &&
            spinTl.current
          ) {
            const currentRotation = gsap.getProperty(
              cursorRef.current,
              "rotation",
            ) as number;
            const normalizedRotation = currentRotation % 360;

            spinTl.current.kill();
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, {
                rotation: "+=360",
                duration: spinDuration,
                ease: "none",
              });

            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration:
                spinDuration *
                (1 - normalizedRotation / 360),
              ease: "none",
              onComplete: () => {
                spinTl.current?.restart();
              },
            });
          }

          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener("mouseleave", leaveHandler);
    };

    window.addEventListener(
      "mouseover",
      enterHandler as EventListener,
    );

    const resizeHandler = () => {
      containingBlockRef.current =
        getContainingBlock(cursor);
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }

      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener(
        "mouseover",
        enterHandler as EventListener,
      );
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener(
        "mousedown",
        mouseDownHandler,
      );
      window.removeEventListener("mouseup", mouseUpHandler);

      if (scope) {
        scope.removeEventListener("mouseenter", showCursor);
        scope.removeEventListener("mouseleave", hideCursor);
        scope.style.cursor = originalScopeCursor;
      } else {
        document.body.style.cursor = originalBodyCursor;
      }

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }

      spinTl.current?.kill();
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current.current = 0;
    };
  }, [
    targetSelector,
    scopeSelector,
    spinDuration,
    moveCursor,
    constants,
    hideDefaultCursor,
    isMobile,
    hoverDuration,
    parallaxOn,
    cursorColor,
    cursorColorOnTarget,
  ]);

  useEffect(() => {
    if (
      isMobile ||
      !cursorRef.current ||
      !spinTl.current
    ) {
      return;
    }

    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, {
          rotation: "+=360",
          duration: spinDuration,
          ease: "none",
        });
    }
  }, [spinDuration, isMobile]);

  if (isMobile || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[2147483647] h-0 w-0"
      style={{ willChange: "transform" }}
    >
      <div
        ref={dotRef}
        className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          willChange: "transform",
          backgroundColor: cursorColor,
        }}
      />
      <div
        className="target-cursor-corner absolute left-1/2 top-1/2 h-3 w-3 -translate-x-[150%] -translate-y-[150%] border-[3px] border-b-0 border-r-0"
        style={{
          willChange: "transform",
          borderColor: cursorColor,
        }}
      />
      <div
        className="target-cursor-corner absolute left-1/2 top-1/2 h-3 w-3 translate-x-1/2 -translate-y-[150%] border-[3px] border-b-0 border-l-0"
        style={{
          willChange: "transform",
          borderColor: cursorColor,
        }}
      />
      <div
        className="target-cursor-corner absolute left-1/2 top-1/2 h-3 w-3 translate-x-1/2 translate-y-1/2 border-[3px] border-l-0 border-t-0"
        style={{
          willChange: "transform",
          borderColor: cursorColor,
        }}
      />
      <div
        className="target-cursor-corner absolute left-1/2 top-1/2 h-3 w-3 -translate-x-[150%] translate-y-1/2 border-[3px] border-r-0 border-t-0"
        style={{
          willChange: "transform",
          borderColor: cursorColor,
        }}
      />
    </div>,
    document.body,
  );
};

export default TargetCursor;
