import init from "@web3-onboard/core"
import { Address } from "viem"
import { SupportedCurrencies } from "../types/currencies"

export type Manifest = {
  marketplaceName: string
  contractAddress: Address | Address[]
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
    id?: string
    name: string
    symbol: string
    address: string
    decimals: number
    thumb?: string
  } | null
  rpcUrl?: string
  areContractsSponsored: boolean
  
  fiatCurrency: {
    enable: boolean
    currencyId: SupportedCurrencies
    currencySymbol: string
  }
}
