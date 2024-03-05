"use client"

import { CurrentCollectionProvider } from "./currentCollection/currentCollectionProvider"
import { ReactQueryProvider } from "./react-query"
import { AppThemeProvider } from "./theme"
import { MarketplaceWagmiProvider } from "./wagmi"
import { Web3OnboardProvider } from "./web3-onboard"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <Web3OnboardProvider>
        <AppThemeProvider>
          <MarketplaceWagmiProvider>
            <CurrentCollectionProvider>{children}</CurrentCollectionProvider>
          </MarketplaceWagmiProvider>
        </AppThemeProvider>
      </Web3OnboardProvider>
    </ReactQueryProvider>
  )
}
