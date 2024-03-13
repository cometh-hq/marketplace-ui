import { CreateConnectorFn } from "wagmi"
import * as connectors from "wagmi/connectors"

import { env } from "@/config/env"

export const walletConnectors: CreateConnectorFn[] = [
  connectors.walletConnect({
    projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    showQrModal: false,
  }),
  connectors.injected(),
]

// if (process.env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY) {
//   const comethConnectConnectorInstance = comethConnectConnector({
//     apiKey: env.NEXT_PUBLIC_MARKETPLACE_API_KEY,
//   })
//   walletConnectors.push(comethConnectConnectorInstance)
// }
