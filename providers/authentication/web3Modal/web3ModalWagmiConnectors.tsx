"use client"

import { CreateConnectorFn } from "wagmi"
import * as connectors from "wagmi/connectors"

import { env } from "@/config/env"
import { comethConnectConnector } from "@cometh/connect-sdk-viem"

export const wagmiConnectors: CreateConnectorFn[] = [
  connectors.walletConnect({
    projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    showQrModal: false,
  }),
  connectors.injected(),
]

if (env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY && typeof window !== "undefined") {
  const comethConnectConnectorInstance = comethConnectConnector({
    apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY,
  })
  wagmiConnectors.push(comethConnectConnectorInstance)
}
