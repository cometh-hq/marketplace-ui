"use client"

import { CurrentCollectionProvider } from "./currentCollection/currentCollectionProvider"
import { MarketplaceWagmiProvider } from "./authentication/marketplaceWagmiProvider"
import { ReactQueryProvider } from "./react-query"
import { AppThemeProvider } from "./theme"
import { MarketplaceRainbowKitProvider } from "./authentication/marketplaceRainbowKitProvider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AppThemeProvider>
        <MarketplaceWagmiProvider>
          <MarketplaceRainbowKitProvider>
            <CurrentCollectionProvider>{children}</CurrentCollectionProvider>
          </MarketplaceRainbowKitProvider>
        </MarketplaceWagmiProvider>
      </AppThemeProvider>
    </ReactQueryProvider>
  )
}
