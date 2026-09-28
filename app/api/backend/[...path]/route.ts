import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_API_URL } from "@/lib/server-api";
import type { ApiResponse } from "@/types";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

type RefreshPayload = ApiResponse<{
  accessToken: string;
  refreshToken?: string;
}>;

function responseFromBackend(
  backend: Response,
  body: ArrayBuffer,
  refreshed?: RefreshPayload["data"],
) {
  const response = new NextResponse(body, {
    status: backend.status,
    headers: {
      "Content-Type": backend.headers.get("content-type") ?? "application/json",
    },
  });

  if (refreshed) {
    response.cookies.set("dap_access_token", refreshed.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });
    if (refreshed.refreshToken) {
      response.cookies.set("dap_refresh_token", refreshed.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }
  }

  return response;
}

async function handler(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("dap_access_token")?.value;
  const refreshToken = cookieStore.get("dap_refresh_token")?.value;

  const incomingUrl = new URL(request.url);
  const targetUrl = `${BACKEND_API_URL}/${path.join("/")}${incomingUrl.search}`;
  const method = request.method;
  const hasBody = !["GET", "HEAD"].includes(method);
  const rawBody = hasBody ? await request.arrayBuffer() : undefined;
  const contentType = request.headers.get("content-type");

  const forward = (token?: string) =>
    fetch(targetUrl, {
      method,
      body: rawBody,
      headers: {
        ...(contentType ? { "Content-Type": contentType } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

  let backend = await forward(accessToken);
  let refreshed: RefreshPayload["data"] | undefined;

  if (backend.status === 401 && refreshToken) {
    const refreshResponse = await fetch(`${BACKEND_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (refreshResponse.ok) {
      const payload = (await refreshResponse.json()) as RefreshPayload;
      refreshed = payload.data;
      backend = await forward(payload.data.accessToken);
    }
  }

  const body = await backend.arrayBuffer();
  return responseFromBackend(backend, body, refreshed);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
