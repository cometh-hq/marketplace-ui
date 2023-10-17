import { Manifest } from "@/types/manifest"

const manifest: Manifest = {
  name: "The Big Whale",
  contractAddress: "0xe7c96dbdef402eac651ede6330f46fbbdd97f175",
  themeClass: "theme-base",

  pages: {
    asset: {
      // if you want to exclude some attributes from the filters, add them here
      excludedAttributesInFilters: ["Border", "Spout"],
      // main attributes shown in the asset page under the asset name
      mainAttributes: ["Grade", "Event", "Whale"],
    },
  },

  network: {
    chainId: 137,
  },

  currency: {
    main: {
      name: "MATIC",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    },
    wrapped: {
      name: "WMATIC",
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    },
  },
}

export { manifest }
