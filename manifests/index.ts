import { Manifest } from "@/types/manifest"

const manifest: Manifest = {
  name: "Dolz",
  contractAddress:"0xd27029e4ebc3c4c55fcfadddc54fa0b911829afc",
  themeClass:"theme-base",

  pages: {
    asset: {
      // if you want to exclude some attributes from the filters, add them here
      excludedAttributesInFilters: [],
      // main attributes shown in the asset page under the asset name
      mainAttributes: ["Rarity", "Nationality"],
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
