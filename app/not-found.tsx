import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--muted-bg)] text-[var(--primary)]">
        <FileQuestion size={26} />
      </span>
      <p className="mt-5 text-sm font-bold text-[var(--primary)]">404</p>
      <h1 className="mt-1 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        The page may have moved or the link may be incorrect.
      </p>
      <Link className="mt-6 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white" href="/">
        Back to home
      </Link>
    </main>
  );
}
