"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Matter, {
  Bodies,
  Body,
  Engine,
  Events,
  Runner,
  World,
} from "matter-js";

type GravityProps = {
  children: ReactNode;
  attractorPoint?: { x: number | string; y: number | string };
  attractorStrength?: number;
  cursorStrength?: number;
  cursorFieldRadius?: number;
  resetOnResize?: boolean;
  addTopWall?: boolean;
  className?: string;
};

type MatterBodyProps = {
  children: ReactNode;
  matterBodyOptions?: Matter.IBodyDefinition;
  x?: number | string;
  y?: number | string;
  angle?: number;
  className?: string;
};

type RegisteredBody = {
  element: HTMLElement;
  body: Matter.Body;
  props: MatterBodyProps;
};

type GravityContextValue = {
  registerElement: (
    id: string,
    element: HTMLElement,
    props: MatterBodyProps,
  ) => void;
  unregisterElement: (id: string) => void;
};

const GravityContext = createContext<GravityContextValue | null>(null);

function calculatePosition(
  value: number | string | undefined,
  containerSize: number,
  elementSize: number,
) {
  if (typeof value === "string" && value.endsWith("%")) {
    const percent = Number.parseFloat(value);
    return Number.isFinite(percent)
      ? (percent / 100) * containerSize
      : elementSize / 2;
  }

  if (typeof value === "number") {
    return Math.abs(value) <= 1 ? value * containerSize : value;
  }

  return elementSize / 2;
}

export function MatterBody({
  children,
  className = "",
  matterBodyOptions = {
    friction: 0.5,
    restitution: 0.2,
    density: 0.001,
    frictionAir: 0.02,
  },
  x = 0,
  y = 0,
  angle = 0,
}: MatterBodyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).slice(2));
  const context = useContext(GravityContext);

  useEffect(() => {
    const element = ref.current;
    if (!element || !context) return;

    context.registerElement(idRef.current, element, {
      children,
      matterBodyOptions,
      x,
      y,
      angle,
      className,
    });

    return () => context.unregisterElement(idRef.current);
  }, [angle, children, className, context, matterBodyOptions, x, y]);

  return (
    <div ref={ref} className={`absolute left-0 top-0 ${className}`}>
      {children}
    </div>
  );
}

export default function Gravity({
  children,
  attractorPoint = { x: "50%", y: "50%" },
  attractorStrength = 0.001,
  cursorStrength = 0.0005,
  cursorFieldRadius = 100,
  resetOnResize = true,
  addTopWall = true,
  className = "",
}: GravityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Engine.create());
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesRef = useRef(new Map<string, RegisteredBody>());
  const frameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -10000, y: -10000 });

  const syncElements = useCallback(() => {
    bodiesRef.current.forEach(({ element, body }) => {
      const rotation = body.angle * (180 / Math.PI);
      element.style.transform = `translate3d(${
        body.position.x - element.offsetWidth / 2
      }px, ${
        body.position.y - element.offsetHeight / 2
      }px, 0) rotate(${rotation}deg)`;
    });

    frameRef.current = requestAnimationFrame(syncElements);
  }, []);

  const unregisterElement = useCallback((id: string) => {
    const entry = bodiesRef.current.get(id);
    if (!entry) return;
    World.remove(engineRef.current.world, entry.body);
    bodiesRef.current.delete(id);
  }, []);

  const registerElement = useCallback(
    (id: string, element: HTMLElement, props: MatterBodyProps) => {
      const container = containerRef.current;
      if (!container) return;

      const width = element.offsetWidth;
      const height = element.offsetHeight;
      const rect = container.getBoundingClientRect();
      const x = calculatePosition(props.x, rect.width, width);
      const y = calculatePosition(props.y, rect.height, height);

      const body = Bodies.circle(
        x,
        y,
        Math.max(width, height) / 2,
        {
          ...props.matterBodyOptions,
          angle: ((props.angle ?? 0) * Math.PI) / 180,
          render: { visible: false },
        },
      );

      World.add(engineRef.current.world, body);
      bodiesRef.current.set(id, { element, body, props });
    },
    [],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = engineRef.current;
    engine.gravity.x = 0;
    engine.gravity.y = 0;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const wallOptions: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      friction: 1,
      render: { visible: false },
    };

    const walls = [
      Bodies.rectangle(width / 2, height + 12, width, 24, wallOptions),
      Bodies.rectangle(width + 12, height / 2, 24, height, wallOptions),
      Bodies.rectangle(-12, height / 2, 24, height, wallOptions),
    ];

    if (addTopWall) {
      walls.push(Bodies.rectangle(width / 2, -12, width, 24, wallOptions));
    }

    World.add(engine.world, walls);

    const applyForces = () => {
      const rect = container.getBoundingClientRect();
      const attractorX = calculatePosition(attractorPoint.x, rect.width, 0);
      const attractorY = calculatePosition(attractorPoint.y, rect.height, 0);

      bodiesRef.current.forEach(({ body }) => {
        const dx = attractorX - body.position.x;
        const dy = attractorY - body.position.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0.001) {
          Body.applyForce(body, body.position, {
            x: (dx / distance) * attractorStrength * body.mass,
            y: (dy / distance) * attractorStrength * body.mass,
          });
        }

        const mdx = mouseRef.current.x - body.position.x;
        const mdy = mouseRef.current.y - body.position.y;
        const mouseDistance = Math.hypot(mdx, mdy);

        if (mouseDistance > 0.001 && mouseDistance < cursorFieldRadius) {
          const falloff = 1 - mouseDistance / cursorFieldRadius;
          Body.applyForce(body, body.position, {
            x:
              (mdx / mouseDistance) *
              cursorStrength *
              body.mass *
              Math.max(0.18, falloff),
            y:
              (mdy / mouseDistance) *
              cursorStrength *
              body.mass *
              Math.max(0.18, falloff),
          });
        }
      });
    };

    Events.on(engine, "beforeUpdate", applyForces);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    frameRef.current = requestAnimationFrame(syncElements);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const handlePointerLeave = () => {
      mouseRef.current = { x: -10000, y: -10000 };
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new ResizeObserver(() => {
      if (!resetOnResize) return;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        window.location.reload();
      }, 300);
    });

    if (resetOnResize) observer.observe(container);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      Events.off(engine, "beforeUpdate", applyForces);
      observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (runnerRef.current) Runner.stop(runnerRef.current);
      World.clear(engine.world, false);
      Engine.clear(engine);
      bodiesRef.current.clear();
    };
  }, [
    addTopWall,
    attractorPoint.x,
    attractorPoint.y,
    attractorStrength,
    cursorFieldRadius,
    cursorStrength,
    resetOnResize,
    syncElements,
  ]);

  return (
    <GravityContext.Provider value={{ registerElement, unregisterElement }}>
      <div
        ref={containerRef}
        className={`absolute inset-0 h-full w-full overflow-hidden ${className}`}
      >
        {children}
      </div>
    </GravityContext.Provider>
  );
}
