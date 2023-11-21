import { Manifest } from "@/types/manifest"

const manifest: Manifest = {
  name: "Brand",
  contractAddress: "0xFB1a1788471f86399f4bdb1eCFD88c774E21dB27",
  themeClass: "theme-base",

  pages: {
    asset: {
      // if you want to exclude some attributes from the filters, add them here
      excludedAttributesInFilters: [],
      // main attributes shown in the asset page under the asset name
      mainAttributes: ["League", "Club", "Season"],
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
