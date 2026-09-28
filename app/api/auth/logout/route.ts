import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_API_URL } from "@/lib/server-api";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("dap_refresh_token")?.value;

  if (refreshToken) {
    await fetch(`${BACKEND_API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    }).catch(() => undefined);
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });

  for (const name of ["dap_access_token", "dap_refresh_token", "dap_role"]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}
