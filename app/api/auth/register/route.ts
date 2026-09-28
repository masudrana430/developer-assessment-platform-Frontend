import { NextResponse } from "next/server";
import { BACKEND_API_URL } from "@/lib/server-api";
import type { ApiResponse, User } from "@/types";

type RegisterResult = ApiResponse<{
  accessToken: string;
  refreshToken: string;
  user: User;
}>;

export async function POST(request: Request) {
  const body = await request.text();
  const backend = await fetch(`${BACKEND_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  const payload = (await backend.json()) as RegisterResult;
  const response = NextResponse.json(payload, { status: backend.status });

  if (backend.ok) {
    const secure = process.env.NODE_ENV === "production";
    response.cookies.set("dap_access_token", payload.data.accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });
    response.cookies.set("dap_refresh_token", payload.data.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    response.cookies.set("dap_role", payload.data.user.role, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  return response;
}
