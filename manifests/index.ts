import { Manifest } from "@/types/manifest"

const manifest: Manifest = {
  name: "Cosmik Marketplace",
  contractAddress: "0x93bfc0Ed248a8e84Bbe5DD71B146705e51345104",
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
    chainId: 2121337,
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

export { manifest }
