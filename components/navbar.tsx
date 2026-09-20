"use client";

import Link from "next/link";
import { clearAuthTokens } from "@/lib/auth";
import { LogOut } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-bold tracking-tight text-slate-900">
          DevAssess
        </Link>

        <nav className="flex items-center gap-5 text-sm text-slate-600">
          <Link href="/assessments" className="hover:text-slate-900">
            Assessments
          </Link>
          <Link href="/dashboard" className="hover:text-slate-900">
            Dashboard
          </Link>
          <Link href="/login" className="hover:text-slate-900">
            Login
          </Link>
          <button
            type="button"
            onClick={() => clearAuthTokens()}
            className="inline-flex items-center gap-1.5 hover:text-slate-900"
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
