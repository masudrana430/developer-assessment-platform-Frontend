"use client";

import { useEffect, useState } from "react";

export default function useLightweightEffects() {
  const [lightweight, setLightweight] = useState(true);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setLightweight(mobile.matches || coarse.matches || reduced.matches);
    };

    update();
    mobile.addEventListener("change", update);
    coarse.addEventListener("change", update);
    reduced.addEventListener("change", update);

    return () => {
      mobile.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return lightweight;
}
