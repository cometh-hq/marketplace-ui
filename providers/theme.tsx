"use client"

import { manifest } from "@/manifests"
import { ThemeProvider } from "next-themes"

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>
}
