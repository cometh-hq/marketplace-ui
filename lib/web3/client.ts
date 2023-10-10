import { polygon } from "@wagmi/core/chains"
import { configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon],
  [publicProvider()]
)
