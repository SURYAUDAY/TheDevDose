import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AuthNav } from "@/components/AuthNav";

export const metadata: Metadata = {
  title: "TheDevDose — Interview Prep, One Dose at a Time",
  description:
    "Animated, playground-driven interview prep across JavaScript, TypeScript, React, Backend, GenAI, and System Design.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <Providers>
          <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white shadow-lg shadow-brand-500/30">
                  Dx
                </span>
                <span>
                  The<span className="text-brand-400">Dev</span>Dose
                </span>
              </Link>
              <nav className="flex items-center gap-1 text-sm text-slate-400">
                <Link href="/learn" className="rounded-md px-3 py-1.5 hover:bg-white/5 hover:text-slate-100">
                  Roadmap
                </Link>
                <Link href="/review" className="rounded-md px-3 py-1.5 hover:bg-white/5 hover:text-slate-100">
                  Review
                </Link>
                <AuthNav />
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="mx-auto mt-20 max-w-6xl px-4 py-10 text-sm text-slate-500">
            <p>TheDevDose — built for interview prep. 423 topics across 6 phases.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
