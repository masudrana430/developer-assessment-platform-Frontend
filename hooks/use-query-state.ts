"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setQuery = useCallback(
    (updates: Record<string, string | number | null | undefined>, resetPage = false) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") params.delete(key);
        else params.set(key, String(value));
      }

      if (resetPage) params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { searchParams, setQuery };
}
