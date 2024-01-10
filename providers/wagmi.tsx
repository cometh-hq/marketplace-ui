"use client"

import { WagmiConfig, createConfig } from "wagmi"

import { publicClient, webSocketPublicClient } from "@/lib/web3/client"
import globalConfig from "@/config/globalConfig"

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})


export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}
