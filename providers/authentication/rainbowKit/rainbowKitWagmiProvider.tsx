"use client"

import { useMemo } from "react"
import { manifest } from "@/manifests/manifests"
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit"
import { Chain } from "@wagmi/chains"
import { createConfig, http, WagmiProvider } from "wagmi"

import { useComethConnectConnector } from "../comethConnectHooks"
import { marketplaceChain } from "../marketplaceWagmiChain"
import { MarketplaceRainbowKitProvider } from "./marketplaceRainbowKitProvider"
import { wagmiConnectors } from "./rainbowKitWagmiConnectors"

const DEFAULT_WAGMI_CONFIG_PARAMS = {
  connectors: wagmiConnectors,
  chains: [marketplaceChain] as [Chain, ...Chain[]],
  transports: {
    [marketplaceChain.id]: http(manifest.rpcUrl),
  },
  ssr: true,
}

export const useOpenLoginModal = () => {
  const { openConnectModal } = useConnectModal()
  return openConnectModal
}

export const wagmiConfig = createConfig(DEFAULT_WAGMI_CONFIG_PARAMS)

export function MarketplaceWagmiProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const comethConnectConnector = useComethConnectConnector()
  const coreWagmiConfig = useMemo(() => {
    const connectors = [...wagmiConnectors]
    if (comethConnectConnector) {
      connectors.push(comethConnectConnector as any)
    }
    return createConfig({
      ...DEFAULT_WAGMI_CONFIG_PARAMS,
      connectors: connectors,
    })
  }, [comethConnectConnector])

  return (
    <WagmiProvider config={coreWagmiConfig}>
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
