import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://developer-assessment-platform-front.vercel.app"),
  title: {
    default: "DevAssess",
    template: "%s | DevAssess",
  },
  description:
    "A full-stack developer assessment platform with secure payments, timed attempts, reviewer evaluation and role-based administration.",
  openGraph: {
    title: "DevAssess",
    description:
      "Developer assessments with Stripe payments, timed attempts and structured evaluation.",
    type: "website",
    url: "https://developer-assessment-platform-front.vercel.app",
    siteName: "DevAssess",
  },
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
