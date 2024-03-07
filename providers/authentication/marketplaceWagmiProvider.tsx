"use client"

import { manifest } from "@/manifests"
import {
  getDefaultConfig,
  getDefaultWallets
} from "@rainbow-me/rainbowkit"
import {
  Chain
} from "@wagmi/chains"
import { http, WagmiProvider } from "wagmi"

import { marketplaceChain } from "./marketplaceWagmiChain"


const { wallets } = getDefaultWallets()

export const wagmiConfig = getDefaultConfig({
  appName: manifest.marketplaceName,
  projectId: manifest.walletConnectProjectId,
  wallets,
  chains: [marketplaceChain] as [Chain, ...Chain[]],
  transports: {
    [marketplaceChain.id]: http(manifest.rpcUrl),
  },
  ssr: true,
})

export function MarketplaceWagmiProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
}
