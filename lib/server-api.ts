import "server-only";

export const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://developer-assessment-platform.onrender.com/api/v1";

export async function publicServerFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BACKEND_API_URL}${path}`, {
    ...init,
    next: { revalidate: 30, ...(init?.next ?? {}) },
  });

  if (!response.ok) {
    throw new Error(`Backend request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
