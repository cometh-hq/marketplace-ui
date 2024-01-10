import init from "@web3-onboard/core"
import { Address } from "viem"

export type Manifest = {
  collectionName: string
  contractAddress: Address
  themeClass: string

  pages: {
    asset: {
      excludedAttributesInFilters: string[]
      mainAttributes?: string[]
    }
  }

  web3Onboard?: {
    theme?: Parameters<typeof init>[0]["theme"]
  }

  chainId: number
  useNativeTokenForOrders: boolean
  erc20: {
    name: string
    symbol: string
    address: string
  } | null,
  rpcUrl?: string
}
