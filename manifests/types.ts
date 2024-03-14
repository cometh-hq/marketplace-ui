import init from "@web3-onboard/core"
import { Address } from "viem"

import { SupportedCurrencies } from "../types/currencies"

export enum AuthenticationUiLibrary {
  RAINBOW_KIT = "RAINBOW_KIT",
  WEB3_MODAL = "WEB3_MODAL",
}

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
  walletConnectProjectId: string
  authenticationUiType: AuthenticationUiLibrary

  fiatCurrency: {
    enable: boolean
    currencyId: SupportedCurrencies
    currencySymbol: string
  }
}
