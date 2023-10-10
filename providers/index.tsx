"use client"

import { ReactQueryProvider } from "./react-query"
import { AppThemeProvider } from "./theme"
import { WagmiProvider } from "./wagmi"
import { Web3Onboard } from "./web3-onboard"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Web3Onboard>
      <ReactQueryProvider>
        <AppThemeProvider>
          <WagmiProvider>
            {children}
          </WagmiProvider>
        </AppThemeProvider>
      </ReactQueryProvider>
    </Web3Onboard>
  )
}
