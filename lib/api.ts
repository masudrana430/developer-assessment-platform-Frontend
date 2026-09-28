export class ApiError extends Error {
  status: number;
  errors?: unknown;

  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type ApiOptions = RequestInit & {
  auth?: boolean;
};

function getMessage(payload: unknown, status: number) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof (payload as { message?: unknown }).message === "string"
  ) {
    return (payload as { message: string }).message;
  }
  return `Request failed with status ${status}`;
}

function getErrors(payload: unknown) {
  if (typeof payload === "object" && payload !== null && "errors" in payload) {
    return (payload as { errors?: unknown }).errors;
  }
  return undefined;
}

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { headers, body, ...rest } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(`/api/backend${path}`, {
    ...rest,
    body,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(headers ?? {}),
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload: unknown = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new ApiError(getMessage(payload, response.status), response.status, getErrors(payload));
  }

  return payload as T;
}

export async function authRequest<T>(
  action: "login" | "register" | "logout",
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`/api/auth/${action}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new ApiError(getMessage(payload, response.status), response.status, getErrors(payload));
  }

  return payload as T;
}
