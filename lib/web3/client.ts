import {
  arbitrum,
  arbitrumNova,
  avalanche,
  base,
  bsc,
  celo,
  cronos,
  fantom,
  gnosis,
  mainnet,
  moonbeam,
  moonriver,
  optimism,
  polygon,
  polygonMumbai,
  polygonZkEvm,
} from "@wagmi/chains"
import { configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    polygon,
    polygonMumbai,
    gnosis,
    avalanche,
    mainnet,
    bsc,
    celo,
    fantom,
    moonbeam,
    moonriver,
    cronos,
    optimism,
    arbitrum,
    arbitrumNova,
    polygonZkEvm,
    base,
  ],
  [publicProvider()]
)
