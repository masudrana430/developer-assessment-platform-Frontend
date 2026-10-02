"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  CheckSquare,
  CircleHelp,
  ClipboardList,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  PanelsTopLeft,
  Shield,
  Sparkles,
  UserPlus,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";
import MobileStaggeredMenu from "@/components/navigation/mobile-staggered-menu";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const primaryLinks: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/assessments", label: "Assessments", icon: ClipboardList },
    { href: "/features", label: "Features", icon: Sparkles },
    { href: "/community", label: "Join Community", icon: UsersRound },
    { href: "/about", label: "About", icon: Info },
    { href: "/pricing", label: "Pricing", icon: BadgeDollarSign },
    { href: "/faq", label: "FAQ", icon: CircleHelp },
  ];

  const roleLinks: Array<NavItem & { show: boolean }> = [
    {
      href: "/attempts",
      label: "My attempts",
      icon: CheckSquare,
      show: user?.role === "CANDIDATE",
    },
    {
      href: "/reviewer",
      label: "Reviewer",
      icon: PanelsTopLeft,
      show: user?.role === "REVIEWER",
    },
    {
      href: "/admin",
      label: "Admin",
      icon: Shield,
      show: user?.role === "ADMIN",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      show: user?.role === "CANDIDATE",
    },
    {
      href: "/profile",
      label: "Profile",
      icon: UserRound,
      show: Boolean(user),
    },
  ].filter((item) => item.show);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  async function signOut() {
    await logout();
    window.location.assign("/");
  }

  function DesktopItem({ item }: { item: NavItem }) {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        href={item.href}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        className={[
          "group relative grid h-11 w-11 place-items-center rounded-2xl border transition-all duration-200",
          active
            ? "border-blue-500/70 bg-blue-600 text-white shadow-[0_8px_24px_rgba(37,99,235,0.28)] ring-1 ring-blue-400/20 dark:border-blue-400/50 dark:bg-blue-500 dark:shadow-[0_8px_28px_rgba(37,99,235,0.30)]"
            : "border-transparent text-slate-600 hover:border-blue-200/70 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:border-white/10 dark:hover:bg-white/[0.07] dark:hover:text-cyan-100",
        ].join(" ")}
      >
        <Icon size={21} strokeWidth={active ? 2.35 : 1.9} />
        <span className="pointer-events-none absolute left-[3.8rem] z-[70] whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 dark:bg-white dark:text-slate-950">
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-20 flex-col items-center border-r border-slate-200/80 bg-white/95 px-3 py-3 shadow-[8px_0_32px_rgba(15,23,42,0.03)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1322]/95 dark:shadow-[8px_0_32px_rgba(0,0,0,0.12)] lg:flex">
        <Link
          href="/"
          aria-label="DevAssess home"
          className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-black tracking-tight text-white shadow-[0_8px_22px_rgba(37,99,235,0.28)] ring-1 ring-blue-400/25 transition hover:scale-[1.03] dark:from-blue-400 dark:to-blue-600"
        >
          DA
        </Link>

        <nav
          className="flex min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Primary navigation"
        >
          {primaryLinks.map((item) => (
            <DesktopItem key={item.href} item={item} />
          ))}

          {roleLinks.length ? (
            <>
              <div className="my-1 h-px w-8 bg-[var(--border)]" />
              {roleLinks.map((item) => (
                <DesktopItem key={item.href} item={item} />
              ))}
            </>
          ) : null}
        </nav>

        <div className="mt-2 flex flex-col items-center gap-2">
          <div className="[&_button]:h-11 [&_button]:w-11 [&_button]:rounded-2xl [&_button]:border-transparent [&_button]:text-slate-600 dark:[&_button]:text-slate-300">
            <ThemeToggle />
          </div>

          {!user ? (
            <>
              <Link
                href="/login"
                aria-label="Sign in"
                className="group relative grid h-11 w-11 place-items-center rounded-2xl border border-transparent text-slate-600 transition hover:border-blue-200/70 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:border-white/10 dark:hover:bg-white/[0.07] dark:hover:text-cyan-100"
              >
                <LogIn size={21} />
                <span className="pointer-events-none absolute left-[3.8rem] z-[70] whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition group-hover:opacity-100 dark:bg-white dark:text-slate-950">
                  Sign in
                </span>
              </Link>

              <Link
                href="/register"
                aria-label="Create account"
                className="group relative grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-[0_8px_22px_rgba(37,99,235,0.24)] transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                <UserPlus size={21} />
                <span className="pointer-events-none absolute left-[3.8rem] z-[70] whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition group-hover:opacity-100 dark:bg-white dark:text-slate-950">
                  Create account
                </span>
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={() => void signOut()}
              aria-label="Logout"
              className="group relative grid h-11 w-11 place-items-center rounded-2xl border border-transparent text-slate-600 transition hover:border-blue-200/70 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:border-white/10 dark:hover:bg-white/[0.07] dark:hover:text-cyan-100"
            >
              <LogOut size={21} />
              <span className="pointer-events-none absolute left-[3.8rem] z-[70] whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition group-hover:opacity-100 dark:bg-white dark:text-slate-950">
                Logout
              </span>
            </button>
          )}
        </div>
      </aside>

      <MobileStaggeredMenu
        items={[...primaryLinks, ...roleLinks].map((item) => ({
          href: item.href,
          label: item.label,
          active: isActive(item.href),
        }))}
        authenticated={Boolean(user)}
        onLogout={signOut}
      />
    </>
  );
}
