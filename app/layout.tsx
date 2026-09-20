import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: "DevAssess",
    template: "%s | DevAssess",
  },
  description: "Developer assessments with secure payments, timed attempts and reviewer evaluation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          {children}
          <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
            DevAssess · Developer Assessment Platform
          </footer>
        </Providers>
      </body>
    </html>
  );
}
