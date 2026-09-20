import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://developer-assessment-platform.onrender.com/api/v1";

type ApiOptions = RequestInit & {
  auth?: boolean;
  retryAuth?: boolean;
};

export class ApiError extends Error {
  status: number;
  errors?: unknown;

  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as ApiResponse<{
    accessToken: string;
    refreshToken?: string;
  }>;
  setAuthTokens(payload.data.accessToken, payload.data.refreshToken ?? refreshToken);
  return payload.data.accessToken;
}

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { auth = false, retryAuth = true, headers, body, ...rest } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const token = auth ? getAccessToken() : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    body,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
  });

  if (response.status === 401 && auth && retryAuth) {
    const nextToken = await refreshAccessToken();
    if (nextToken) {
      return apiRequest<T>(path, { ...options, retryAuth: false });
    }
    clearAuthTokens();
  }

  const text = await response.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.message
        ? data.message
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data?.errors);
  }

  return data as T;
}
