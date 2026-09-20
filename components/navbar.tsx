"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, ClipboardList, UserRound, Shield, CheckSquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const links = [
    { href: "/assessments", label: "Assessments", icon: ClipboardList, show: true },
    { href: "/attempts", label: "My attempts", icon: CheckSquare, show: user?.role === "CANDIDATE" },
    { href: "/reviewer", label: "Reviewer", icon: CheckSquare, show: user?.role === "REVIEWER" },
    { href: "/admin", label: "Admin", icon: Shield, show: user?.role === "ADMIN" },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: Boolean(user) },
    { href: "/profile", label: "Profile", icon: UserRound, show: Boolean(user) },
  ].filter((item) => item.show);

  function close() {
    setOpen(false);
  }

  function signOut() {
    logout();
    setOpen(false);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color:var(--card)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" onClick={close} className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] text-sm text-white">DA</span>
          <span>DevAssess</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!user ? (
            <Link href="/login" className="hidden rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white sm:inline-flex">
              Sign in
            </Link>
          ) : (
            <button onClick={signOut} className="hidden h-10 items-center gap-2 rounded-xl border border-[var(--border)] px-3 text-sm font-semibold sm:inline-flex">
              <LogOut size={16} /> Logout
            </button>
          )}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Open menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--card)] px-4 py-3 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-[var(--muted-bg)]">
                <Icon size={17} /> {label}
              </Link>
            ))}
            {!user ? (
              <>
                <Link href="/login" onClick={close} className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-[var(--muted-bg)]">Sign in</Link>
                <Link href="/register" onClick={close} className="rounded-xl bg-[var(--primary)] px-3 py-3 text-center text-sm font-semibold text-white">Create account</Link>
              </>
            ) : (
              <button onClick={signOut} className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold hover:bg-[var(--muted-bg)]">
                <LogOut size={17} /> Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
