"use client";

import { useEffect, useState } from "react";

export default function useSmallDevice() {
  const [small, setSmall] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setSmall(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return small;
}
