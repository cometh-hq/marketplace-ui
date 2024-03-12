"use client"

import { manifest } from "@/manifests/manifests"
import { Chain } from "@wagmi/chains"
import { createConfig, http, WagmiProvider } from "wagmi"

import { marketplaceChain } from "./marketplaceWagmiChain"
import { walletConnectors } from "./rainbowkitConnectors"
import { createWeb3Modal } from "@web3modal/wagmi/react";

export const wagmiConfig = createConfig({
  connectors: walletConnectors,
  chains: [marketplaceChain] as [Chain, ...Chain[]],
  transports: {
    [marketplaceChain.id]: http(manifest.rpcUrl),
  },
  ssr: true,
})

createWeb3Modal({
  wagmiConfig,
  projectId: manifest.walletConnectProjectId,
  connectorImages: {
    "cometh-connect":
      "https://pbs.twimg.com/profile_images/1679433363818442753/E2kNVLBe_400x400.jpg",
  },
})

export function MarketplaceWagmiProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
}
