import {
  comethConnectConnector,
  comethConnectWallet,
} from "@cometh/connect-sdk-viem"

import { env } from "@/config/env"

const comethConnectConnectorInstance = comethConnectConnector({
  apiKey: env.NEXT_PUBLIC_MARKETPLACE_API_KEY
})

// export const rainbowKitConnectors = connectorsForWallets(
//   [
//     {
//       groupName: "Recommended",
//       wallets: [
//         () => comethConnectConnector,
//       ],
//     },
//   ],
//   {
//     appName: manifest.marketplaceName,
//     projectId: manifest.walletConnectProjectId,
//   }
// )

export const walletConnectors = [comethConnectConnectorInstance]
