"use client";

import { useEffect, useState } from "react";

const SCREEN_SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
type ScreenSize = (typeof SCREEN_SIZES)[number];

const order: Record<ScreenSize, number> = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  "2xl": 5,
};

class ComparableScreenSize {
  constructor(private readonly value: ScreenSize) {}

  toString() {
    return this.value;
  }

  valueOf() {
    return order[this.value];
  }

  lessThan(other: ScreenSize) {
    return this.valueOf() < order[other];
  }

  greaterThan(other: ScreenSize) {
    return this.valueOf() > order[other];
  }
}

export default function useScreenSize() {
  const [screenSize, setScreenSize] = useState<ScreenSize>("xs");

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1536) setScreenSize("2xl");
      else if (width >= 1280) setScreenSize("xl");
      else if (width >= 1024) setScreenSize("lg");
      else if (width >= 768) setScreenSize("md");
      else if (width >= 640) setScreenSize("sm");
      else setScreenSize("xs");
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return new ComparableScreenSize(screenSize);
}
