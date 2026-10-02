"use client";

import { useEffect, useState } from "react";

export default function useLargeDevice() {
  const [large, setLarge] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setLarge(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return large;
}
