import { Address } from "viem"

import { Manifest } from "@/types/manifest"
import { env } from "@/config/env"

const manifest: Manifest = {
  collectionName: "My NFT collection",
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

  chainId: env.NEXT_PUBLIC_NETWORK_ID || 137,

  useNativeTokenForOrders: true,
  erc20: {
    name: "My Token",
    symbol: "MTK",
    address: "0x42f671d85624b835f906d3aacc47745795e4b4f8",
    // put your logo in the '/public/tokens' folder and update the following line (example: "mytoken.png")
    thumb: "", 
  },
  rpcUrl: env.NEXT_PUBLIC_RPC_URL
}

export { manifest }
