"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10 text-red-600">
        <AlertTriangle size={26} />
      </span>
      <h1 className="mt-5 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        The page could not be completed. Your data is safe; retry the request or return to the dashboard.
      </p>
      <Button className="mt-6" onClick={reset}>
        <RotateCcw size={16} /> Try again
      </Button>
    </main>
  );
}
