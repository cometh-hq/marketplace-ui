import { Address } from "viem"

import { Manifest } from "@/types/manifest"

const manifest: Manifest = {
  name: "Cosmik Marketplace",
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
      name: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    },
    wrapped: {
      name: "WETH",
      address: "0xd9eF5BE1AB8AC56325eDd51f995BBCa0eBE7D9e8",
    },
  },
}

if (!manifest.contractAddress || manifest.contractAddress.indexOf("0x") !== 0) {
  throw new Error("Contract address is not correctly defined in the manifest")
}

export { manifest }
