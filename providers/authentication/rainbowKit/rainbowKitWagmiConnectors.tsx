import { getComethConnectWallet } from "@cometh/connect-sdk-viem"
import { connectorsForWallets, getDefaultWallets } from "@rainbow-me/rainbowkit"

import { env } from "@/config/env"

const wallets = getDefaultWallets().wallets
if (env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY && typeof window !== "undefined") {
  const comethConnectWallet = getComethConnectWallet({
    apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY,
  })
  wallets.unshift({
    groupName: "Recommended",
    wallets: [comethConnectWallet as any],
  })
}

export const wagmiConnectors = connectorsForWallets(wallets, {
  appName: "Cometh",
  projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
})
