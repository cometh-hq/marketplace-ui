import "@/styles/globals.css"
import { Metadata } from "next"
import { AppProviders } from "@/providers"

import { siteConfig } from "@/config/site"
import { ChakraFont } from "@/lib/utils/fonts"
import { cn } from "@/lib/utils/utils"
import { Toaster } from "@/components/ui/toast/toaster"
import { AppContent } from "@/components/content"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
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
          ChakraFont.variable,
          `min-h-screen bg-[url('/main-bg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat font-sans antialiased`
        )}
      >
        <AppProviders>
          <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <SiteHeader />
            <AppContent>{children}</AppContent>
          </div>

          {/* <TailwindIndicator /> */}
        </AppProviders>
        <Toaster />
      </body>
    </html>
  )
}
