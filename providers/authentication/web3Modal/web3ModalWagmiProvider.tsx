"use client"

import { useCallback, useEffect, useMemo } from "react"
import { manifest } from "@/manifests/manifests"
import { Chain } from "@wagmi/chains"
import { createWeb3Modal, useWeb3Modal } from "@web3modal/wagmi/react"
import { createConfig, CreateConnectorFn, http, WagmiProvider } from "wagmi"

import { useComethConnectConnector } from "../comethConnectHooks"
import { marketplaceChain } from "../marketplaceWagmiChain"
import { wagmiConnectors } from "./web3ModalWagmiConnectors"

const DEFAULT_WAGMI_CONFIG_PARAMS = {
  connectors: wagmiConnectors,
  chains: [marketplaceChain] as [Chain, ...Chain[]],
  transports: {
    [marketplaceChain.id]: http(manifest.rpcUrl),
  },
  ssr: true,
}

export const wagmiConfig = createConfig(DEFAULT_WAGMI_CONFIG_PARAMS)

createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId: manifest.walletConnectProjectId,
  connectorImages: {},
})

export const useOpenLoginModal = () => {
  const { open } = useWeb3Modal()
  return open
}

export function MarketplaceWagmiProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const comethConnectConnector = useComethConnectConnector()

  const getWagmiConfig = useCallback(
    (connectorToInsert?: CreateConnectorFn) => {
      const connectors = [...wagmiConnectors]
      if (connectorToInsert) {
        connectors.push(connectorToInsert)
      }
      return createConfig({
        ...DEFAULT_WAGMI_CONFIG_PARAMS,
        connectors: connectors,
      })
    },
    []
  )

  const coreWagmiConfig = useMemo(
    () => getWagmiConfig(comethConnectConnector as any),
    [getWagmiConfig, comethConnectConnector]
  )

  return <WagmiProvider config={coreWagmiConfig}>{children}</WagmiProvider>
}
