import { Address } from "viem"

import { Manifest } from "@/types/manifest"
import { env } from "@/config/env"

const manifest: Manifest = {
  name: "My NFT collection",
  contractAddress: env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
  themeClass: "theme-base",

  pages: {
    asset: {
      // if you want to exclude some attributes from the filters, add them here
      excludedAttributesInFilters: [],
      // main attributes shown in the asset page under the asset name
      mainAttributes: [],
    },
  },

  network: {
    chainId: env.NEXT_PUBLIC_NETWORK_ID || 137,
  },

  currency: {
    main: {
      name: "MTK",
      address: "0x42F671d85624B835f906D3AAcC47745795e4B4F8",
    },
    wrapped: {
      name: "WMATIC",
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    },
  },
}

if (!manifest.contractAddress || manifest.contractAddress.indexOf("0x") !== 0) {
  throw new Error("Contract address is not correctly defined in the manifest")
}

export { manifest }
