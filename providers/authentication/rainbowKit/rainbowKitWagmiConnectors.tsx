import { connectorsForWallets, getDefaultWallets } from "@rainbow-me/rainbowkit"

import { env } from "@/config/env"

const wallets = getDefaultWallets().wallets


export const wagmiConnectors = connectorsForWallets(wallets, {
  appName: "Cometh",
  projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
})
