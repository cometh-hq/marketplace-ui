// import { getComethConnectWallet } from "@cometh/connect-sdk-viem"
import { connectorsForWallets, getDefaultWallets } from "@rainbow-me/rainbowkit"

import { env } from "@/config/env"

// const comethConnect = getComethConnectWallet({
//   apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY,
// })

export const wagmiConnectors = connectorsForWallets(
  [
    // {
    //   groupName: "Recommended",
    //   wallets: [comethConnect],
    // },
    ...getDefaultWallets().wallets,
  ],
  {
    appName: "Cometh",
    projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
  }
)
