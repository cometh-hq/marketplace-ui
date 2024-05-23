"use client"

import globalConfig from "@/config/globalConfig"
import {
  arbitrum,
  avalanche,
  bsc,
  celo,
  fantom,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonMumbai,
} from "@wagmi/chains"
import { polygonAmoy, arbitrumSepolia } from "viem/chains"

const wagmiChains = [
  mainnet,
  goerli,
  optimism,
  bsc,
  polygon,
  fantom,
  arbitrum,
  celo,
  avalanche,
  polygonMumbai,
  polygonAmoy,
  arbitrumSepolia
]
let matchingChain = wagmiChains.find(
  (chain) => chain.id === globalConfig.network.chainId
)

if (!matchingChain) {
  throw new Error(
    `Wagmi chain found for network ${globalConfig.network.chainId}. Check if it can be imported or add it manually`
  )
}

export const marketplaceChain = matchingChain
