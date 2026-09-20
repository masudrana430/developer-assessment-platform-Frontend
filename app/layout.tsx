import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Developer Assessment Platform",
  description: "Frontend for the Developer Assessment Platform backend",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
