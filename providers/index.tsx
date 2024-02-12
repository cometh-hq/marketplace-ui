"use client"

import { ReactQueryProvider } from "./react-query"
import { MarketplaceWagmiProvider } from "./wagmi"
import { Web3OnboardProvider } from "./web3-onboard"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <Web3OnboardProvider>
        <MarketplaceWagmiProvider>{children}</MarketplaceWagmiProvider>
      </Web3OnboardProvider>
    </ReactQueryProvider>
  )
}
