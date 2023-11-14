import init from "@web3-onboard/core"
import { Address } from "viem"

export type Manifest = {
  name: string
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

  network: {
    chainId: string | number
  }

  currency: {
    main: {
      name: string
      address: Address
    }
    wrapped: {
      name: string
      address: Address
    }
  }
}
