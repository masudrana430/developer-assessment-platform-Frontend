"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import type { ApiResponse, User } from "@/types";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiRequest<ApiResponse<User>>("/users/me", { auth: true }),
    retry: false,
  });

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600">Base authenticated dashboard connected to GET /users/me.</p>

      <div className="mt-8 max-w-xl">
        <Card>
          {isLoading && <p>Loading profile...</p>}
          {error && (
            <p className="text-red-600">
              {error instanceof Error ? error.message : "Unable to load profile. Please login first."}
            </p>
          )}

          {data?.data && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{data.data.name}</h2>
              <p className="text-sm text-slate-600">{data.data.email}</p>
              <span className="inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {data.data.role}
              </span>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
