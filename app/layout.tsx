import "@/styles/globals.css"

import { Suspense } from "react"
import { Metadata } from "next"
import { AppProviders } from "@/providers/appProviders"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/utils/fonts"
import { cn } from "@/lib/utils/utils"
import { Toaster } from "@/components/ui/toast/Toaster"
import { AppContent } from "@/components/AppContent"
import { SiteHeader } from "@/components/SiteHeader"
import { TailwindIndicator } from "@/components/TailwindIndicator"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable
        )}
      >
        <AppProviders>
          <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <SiteHeader />
            <AppContent>{children}</AppContent>
          </div>

          <TailwindIndicator />
        </AppProviders>
        <Toaster />
      </body>
    </html>
  )
}
