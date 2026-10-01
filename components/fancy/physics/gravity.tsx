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
  Engine,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  World,
} from "matter-js";

type GravityProps = {
  children: ReactNode;
  gravity?: { x: number; y: number };
  className?: string;
  debug?: boolean;
  resetOnResize?: boolean;
  grabCursor?: boolean;
  addTopWall?: boolean;
};

type MatterBodyProps = {
  children: ReactNode;
  matterBodyOptions?: Matter.IBodyDefinition;
  isDraggable?: boolean;
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
    const percentage = Number.parseFloat(value);
    if (Number.isFinite(percentage)) {
      return (percentage / 100) * containerSize;
    }
  }

  if (typeof value === "number") return value;
  return elementSize / 2;
}

export function MatterBody({
  children,
  className = "",
  matterBodyOptions = {
    friction: 0.1,
    restitution: 0.1,
    density: 0.001,
    isStatic: false,
  },
  isDraggable = true,
  x = 0,
  y = 0,
  angle = 0,
}: MatterBodyProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).slice(2));
  const context = useContext(GravityContext);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !context) return;

    context.registerElement(idRef.current, element, {
      children,
      matterBodyOptions,
      isDraggable,
      x,
      y,
      angle,
      className,
    });

    return () => {
      context.unregisterElement(idRef.current);
    };
  }, [angle, children, className, context, isDraggable, matterBodyOptions, x, y]);

  return (
    <div
      ref={elementRef}
      className={`absolute left-0 top-0 ${isDraggable ? "pointer-events-none" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export default function Gravity({
  children,
  gravity = { x: 0, y: 1 },
  className = "",
  debug = false,
  resetOnResize = true,
  grabCursor = true,
  addTopWall = true,
}: GravityProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const bodiesMapRef = useRef(new Map<string, RegisteredBody>());
  const frameRef = useRef<number | null>(null);

  const syncElements = useCallback(() => {
    bodiesMapRef.current.forEach(({ element, body }) => {
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
    const entry = bodiesMapRef.current.get(id);
    const engine = engineRef.current;
    if (!entry || !engine) return;

    World.remove(engine.world, entry.body);
    bodiesMapRef.current.delete(id);
  }, []);

  const registerElement = useCallback(
    (id: string, element: HTMLElement, props: MatterBodyProps) => {
      const container = canvasRef.current;
      const engine = engineRef.current;
      if (!container || !engine) return;

      const width = element.offsetWidth;
      const height = element.offsetHeight;
      const rect = container.getBoundingClientRect();

      const positionX = calculatePosition(props.x, rect.width, width);
      const positionY = calculatePosition(props.y, rect.height, height);
      const angleRadians = ((props.angle ?? 0) * Math.PI) / 180;

      const body = Bodies.rectangle(positionX, positionY, width, height, {
        ...props.matterBodyOptions,
        angle: angleRadians,
        render: {
          fillStyle: debug ? "rgba(37,99,235,0.22)" : "transparent",
          strokeStyle: debug ? "#2563eb" : "transparent",
          lineWidth: debug ? 2 : 0,
        },
      });

      World.add(engine.world, body);
      bodiesMapRef.current.set(id, { element, body, props });
    },
    [debug],
  );

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    function initialize() {
      const host = canvasRef.current;
      if (!host || disposed) return;

      const width = host.offsetWidth;
      const height = host.offsetHeight;
      if (!width || !height) return;

      const engine = Engine.create();
      engine.gravity.x = gravity.x;
      engine.gravity.y = gravity.y;
      engineRef.current = engine;

      const render = Render.create({
        element: host,
        engine,
        options: {
          width,
          height,
          wireframes: false,
          background: "transparent",
        },
      });
      render.canvas.style.position = "absolute";
      render.canvas.style.inset = "0";
      render.canvas.style.width = "100%";
      render.canvas.style.height = "100%";
      render.canvas.style.background = "transparent";
      render.canvas.style.zIndex = "20";
      renderRef.current = render;

      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: debug },
        },
      });
      mouseConstraintRef.current = mouseConstraint;

      const wallOptions: Matter.IChamferableBodyDefinition = {
        isStatic: true,
        friction: 1,
        render: { visible: debug },
      };

      const walls: Matter.Body[] = [
        Bodies.rectangle(width / 2, height + 10, width, 20, wallOptions),
        Bodies.rectangle(width + 10, height / 2, 20, height, wallOptions),
        Bodies.rectangle(-10, height / 2, 20, height, wallOptions),
      ];

      if (addTopWall) {
        walls.push(Bodies.rectangle(width / 2, -10, width, 20, wallOptions));
      }

      World.add(engine.world, [mouseConstraint, ...walls]);

      const runner = Runner.create();
      runnerRef.current = runner;
      Render.run(render);
      Runner.run(runner, engine);
      frameRef.current = requestAnimationFrame(syncElements);

      if (grabCursor) {
        render.canvas.style.cursor = "grab";
        render.canvas.addEventListener("mousedown", () => {
          render.canvas.style.cursor = "grabbing";
        });
        render.canvas.addEventListener("mouseup", () => {
          render.canvas.style.cursor = "grab";
        });
      }
    }

    function cleanup() {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      const engine = engineRef.current;
      const render = renderRef.current;
      const runner = runnerRef.current;
      const mouseConstraint = mouseConstraintRef.current;

      if (engine && mouseConstraint) {
        World.remove(engine.world, mouseConstraint);
      }

      if (render) {
        Mouse.clearSourceEvents(render.mouse);
        Render.stop(render);
        render.canvas.remove();
        render.textures = {};
      }

      if (runner) Runner.stop(runner);

      if (engine) {
        World.clear(engine.world, false);
        Engine.clear(engine);
      }

      bodiesMapRef.current.clear();
      engineRef.current = null;
      renderRef.current = null;
      runnerRef.current = null;
      mouseConstraintRef.current = null;
    }

    function reset() {
      cleanup();
      requestAnimationFrame(initialize);
    }

    initialize();

    const observer = new ResizeObserver(() => {
      if (!resetOnResize) return;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(reset, 250);
    });
    observer.observe(container);

    return () => {
      disposed = true;
      observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      cleanup();
    };
  }, [
    addTopWall,
    grabCursor,
    gravity.x,
    gravity.y,
    resetOnResize,
    syncElements,
    debug,
  ]);

  return (
    <GravityContext.Provider value={{ registerElement, unregisterElement }}>
      <div
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full overflow-hidden ${className}`}
      >
        {children}
      </div>
    </GravityContext.Provider>
  );
}
