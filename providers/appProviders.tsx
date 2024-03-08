"use client"

import { MarketplaceRainbowKitProvider } from "./authentication/marketplaceRainbowKitProvider"
import { MarketplaceWagmiProvider } from "./authentication/marketplaceWagmiProvider"
import { CurrentCollectionProvider } from "./currentCollection/currentCollectionProvider"
import { ReactQueryProvider } from "./react-query"
import { AppThemeProvider } from "./theme"

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
