export type Role = "CANDIDATE" | "REVIEWER" | "ADMIN";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "BLOCKED";
  avatarUrl?: string | null;
}

export interface Assessment {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "JUNIOR" | "MID" | "SENIOR";
  durationMinutes: number;
  passingScore: number;
  feeCents: number;
  currency: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
}
