import { comethConnectConnector } from "@cometh/connect-sdk-viem"
import { CreateConnectorFn } from "wagmi"
import * as connectors from "wagmi/connectors"

import { env } from "@/config/env"

const comethConnectConnectorInstance = comethConnectConnector({
  apiKey: env.NEXT_PUBLIC_MARKETPLACE_API_KEY,
})

export const walletConnectors: CreateConnectorFn[] = [
  connectors.walletConnect({
    projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    showQrModal: false,
  }),
  connectors.injected(),
]

if (process.env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY) {
  walletConnectors.push(comethConnectConnectorInstance)
}
