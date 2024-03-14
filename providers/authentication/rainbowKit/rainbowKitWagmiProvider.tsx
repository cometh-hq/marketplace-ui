"use client"

import { manifest } from "@/manifests/manifests"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Chain } from "@wagmi/chains"
import { createConfig, http, WagmiProvider } from "wagmi"

import { marketplaceChain } from "../marketplaceWagmiChain"
import { MarketplaceRainbowKitProvider } from "./marketplaceRainbowKitProvider"
import { wagmiConnectors } from "./rainbowKitWagmiConnectors"
import { useConnectModal } from "@rainbow-me/rainbowkit";

export const wagmiConfig = createConfig({
  connectors: wagmiConnectors,
  chains: [marketplaceChain] as [Chain, ...Chain[]],
  transports: {
    [marketplaceChain.id]: http(manifest.rpcUrl),
  },
  ssr: true,
})

export const useOpenLoginModal = () => {
  const { openConnectModal } = useConnectModal();
  return openConnectModal
} 

export function MarketplaceWagmiProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <MarketplaceRainbowKitProvider>
        <>
          <div className="hidden">
            <ConnectButton />;
          </div>
          {children}
        </>
      </MarketplaceRainbowKitProvider>
    </WagmiProvider>
  )
}
