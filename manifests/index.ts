import { Manifest } from "@/types/manifest"

const manifest: Manifest = {
  name: "My NFT collection",
  contractAddress: "0x8634666ba15ada4bbc83b9dbf285f73d9e46e4c2",
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

if(!manifest.contractAddress) {
  throw new Error("Contract address is not defined in the manifest")
}

export { manifest }
