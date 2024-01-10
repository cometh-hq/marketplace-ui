"use client"

import { manifest } from "@/manifests"
import {
  Chain,
  arbitrum,
  avalanche,
  bsc,
  celo,
  fantom,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonMumbai,
} from "@wagmi/chains"
import { WagmiProvider, createConfig, http } from "wagmi"

import globalConfig from "@/config/globalConfig"

const wagmiChains = [
  mainnet,
  goerli,
  optimism,
  bsc,
  polygon,
  fantom,
  arbitrum,
  celo,
  avalanche,
  polygonMumbai,
]
const marketplaceChain = wagmiChains.find(
  (chain) => chain.id === globalConfig.network.chainId
)

if (!marketplaceChain) {
  throw new Error(
    `Wagmi chain found for network ${globalConfig.network.chainId}. Check if it can be imported or add it manually`
  )
}

export const wagmiConfig = createConfig({
  chains: [marketplaceChain] as [Chain, ...Chain[]],
  transports: {
    [marketplaceChain.id]: http(manifest.rpcUrl),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig
  }
}

export function MarketplaceWagmiProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
}
