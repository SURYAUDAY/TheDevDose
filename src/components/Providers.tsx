"use client";

import { SessionProvider } from "next-auth/react";
import { ProgressProvider } from "./progress/ProgressProvider";
import { LangProvider } from "./LangProvider";
import { SessionTracker } from "./analytics/Trackers";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LangProvider>
        <ProgressProvider>
          <SessionTracker />
          {children}
        </ProgressProvider>
      </LangProvider>
    </SessionProvider>
  );
}
