"use client";

import { SessionProvider } from "next-auth/react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <SessionProvider>{children}</SessionProvider>
    </NextThemesProvider>
  );
}
