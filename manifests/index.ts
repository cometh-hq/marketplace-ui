import { Address } from "viem"

import { Manifest } from "@/types/manifest"

const manifest: Manifest = {
  name: "My NFT collection",
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
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
    chainId: process.env.NEXT_PUBLIC_NETWORK_ID || 137,
  },

  currency: {
    main: {
      name: "MATIC",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    },
    wrapped: {
      name: "WMATIC",
      address: "0x42f671d85624b835f906d3aacc47745795e4b4f8",
    },
  },
}

if (!manifest.contractAddress || manifest.contractAddress.indexOf("0x") !== 0) {
  throw new Error("Contract address is not correctly defined in the manifest")
}

export { manifest }
