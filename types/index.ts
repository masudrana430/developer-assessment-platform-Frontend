export type Role = "CANDIDATE" | "REVIEWER" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";
export type Difficulty = "JUNIOR" | "MID" | "SENIOR";
export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type QuestionType = "MCQ" | "TEXT" | "CODE";
export type AttemptStatus =
  | "PENDING_PAYMENT"
  | "READY"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "EVALUATED"
  | "CANCELLED";
export type PaymentStatus =
  | "PENDING"
  | "REQUIRES_ACTION"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED";

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Meta;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionAnswer {
  id: string;
  response: unknown;
  autoScore?: number | null;
  reviewerScore?: number | null;
  feedback?: string | null;
}

export interface Question {
  id: string;
  assessmentId?: string;
  prompt: string;
  type: QuestionType;
  options?: unknown;
  correctAnswer?: unknown;
  points: number;
  order: number;
  answers?: QuestionAnswer[];
}

export interface Assessment {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  durationMinutes: number;
  passingScore: number;
  feeCents: number;
  currency: string;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt?: string;
  createdById?: string;
  creator?: { id: string; name: string };
  questions?: Question[];
  _count?: { questions?: number; attempts?: number };
}

export interface Payment {
  id: string;
  attemptId: string;
  userId?: string;
  stripePaymentIntentId?: string | null;
  stripeCheckoutSessionId?: string | null;
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  failureReason?: string | null;
}

export interface Review {
  id?: string;
  feedback: string;
  decision: "PASS" | "FAIL";
  totalScore: number;
  createdAt: string;
}

export interface Attempt {
  id: string;
  attemptNo: number;
  status: AttemptStatus;
  startedAt?: string | null;
  expiresAt?: string | null;
  submittedAt?: string | null;
  evaluatedAt?: string | null;
  autoScore?: number | null;
  finalScore?: number | null;
  passed?: boolean | null;
  createdAt?: string;
  assessment: Partial<Assessment> & {
    id: string;
    title: string;
    questions?: Question[];
  };
  candidate?: { id: string; name: string; email?: string };
  payment?: Payment | null;
  review?: Review | null;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: unknown;
  createdAt: string;
  actor?: Pick<User, "id" | "name" | "email" | "role"> | null;
}

export interface AdminStats {
  users: { total: number; candidates: number; reviewers: number };
  assessments: { published: number };
  attempts: { total: number; evaluated: number };
  payments: { successfulCount: number; grossAmountInMinorUnits: number };
}
