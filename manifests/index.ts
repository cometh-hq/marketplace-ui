import { Address } from "viem"

import { Manifest } from "@/types/manifest"
import { env } from "@/config/env"

const manifest: Manifest = {
  collectionName: "Cosmik Marketplace",
  contractAddress: env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
  themeClass: "theme-base",

  pages: {
    asset: {
      // if you want to exclude some attributes from the filters, add them here
      excludedAttributesInFilters: ["type_id"], // type_id is get from Cosmik API and return name + type_id
      // main attributes shown in the asset page under the asset name
      mainAttributes: [],
    },
  },

  chainId: env.NEXT_PUBLIC_NETWORK_ID || 137,

  // Set to true if you want to use the native token for orders
  useNativeTokenForOrders: true,
  // The ERC20 token used if useNativeTokenForOrders is false
  erc20: {
    name: "USDC",
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 18,
    // put your logo in the '/public/tokens' folder and update the following line (example: "mytoken.png")
    thumb: "", 
  },
  // Optional for development but strongly recommended for production use
  rpcUrl: env.NEXT_PUBLIC_RPC_URL,
  // Set to true if contracts transactions are sponsored for Cometh Connect users.
  // Contracts to sponsor are your ERC721, 0x exchange and either the wrapped native token contract or your ERC20
  areContractsSponsored: true
}

export { manifest }
