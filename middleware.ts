import { NextRequest, NextResponse } from "next/server";
import type { Role } from "@/types";

const protectedRules: Array<{ prefix: string; roles: Role[] }> = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/reviewer", roles: ["REVIEWER"] },
  { prefix: "/dashboard", roles: ["CANDIDATE"] },
  { prefix: "/attempts", roles: ["CANDIDATE"] },
  { prefix: "/profile", roles: ["CANDIDATE", "REVIEWER", "ADMIN"] },
  { prefix: "/payment", roles: ["CANDIDATE"] },
];

function dashboardFor(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "REVIEWER") return "/reviewer";
  return "/dashboard";
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const role = request.cookies.get("dap_role")?.value;
  const hasSession = Boolean(
    request.cookies.get("dap_refresh_token")?.value ||
      request.cookies.get("dap_access_token")?.value,
  );

  const protectedRule = protectedRules.find(
    (rule) => pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`),
  );

  if (protectedRule) {
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!role || !protectedRule.roles.includes(role as Role)) {
      return NextResponse.redirect(new URL(dashboardFor(role), request.url));
    }
  }

  // Keep the login page accessible even when a session cookie exists.
  // This is useful for switching accounts, demo logins and direct login-page access.
  if (pathname === "/register" && hasSession && role) {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/reviewer/:path*",
    "/dashboard/:path*",
    "/attempts/:path*",
    "/profile/:path*",
    "/payment/:path*",
    "/login",
    "/register",
  ],
};
