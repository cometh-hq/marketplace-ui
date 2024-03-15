"use client"

import { MarketplaceWagmiProvider } from "@/providers/authentication/authenticationUiSwitch"
import { CurrentCollectionProvider } from "./currentCollection/currentCollectionProvider"
import { ReactQueryProvider } from "./react-query"
import { AppThemeProvider } from "./theme"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AppThemeProvider>
        <MarketplaceWagmiProvider>
          <CurrentCollectionProvider>{children}</CurrentCollectionProvider>
        </MarketplaceWagmiProvider>
      </AppThemeProvider>
    </ReactQueryProvider>
  )
}
