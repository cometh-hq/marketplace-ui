"use client"

import { ReactQueryProvider } from "./react-query"
import { AppThemeProvider } from "./theme"
import { WagmiProvider } from "./wagmi"
import { Web3OnboardProvider } from "./web3-onboard"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <Web3OnboardProvider>
        <AppThemeProvider>
          <WagmiProvider>{children}</WagmiProvider>
        </AppThemeProvider>
      </Web3OnboardProvider>
    </ReactQueryProvider>
  )
}
