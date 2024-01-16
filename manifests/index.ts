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

  // Set to true if you want to use the native token for orders
  useNativeTokenForOrders: false,
  // The ERC20 token used if useNativeTokenForOrders is false
  erc20: {
    name: "My Token",
    symbol: "MTK",
    address: "0x42f671d85624b835f906d3aacc47745795e4b4f8",
    // put your logo in the '/public/tokens' folder and update the following line (example: "mytoken.png")
    thumb: "", 
  },
  // Optional for development but strongly recommended for production use
  rpcUrl: env.NEXT_PUBLIC_RPC_URL,
  // Set to true if contracts transactions are sponsored for Cometh Connect users.
  // Contracts to sponsor are your ERC721, 0x exchange and either the wrapped native token contract or your ERC20
  areContractsSponsored: false
}

export { manifest }
