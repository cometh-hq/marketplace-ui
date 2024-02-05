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
import { type Chain as ViemChain } from 'viem'

import globalConfig from "@/config/globalConfig"

export const musterTestnet = {
  id: 2121337,
  name: 'Muster Anytrust Sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://muster-anytrust.alt.technology'] },
  },
  blockExplorers: {
    default: { name: 'Muster anytrust', url: 'https://muster-anytrust-explorer.alt.technology/' },
  },
  testnet: true
} as const satisfies ViemChain

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
  musterTestnet,
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
