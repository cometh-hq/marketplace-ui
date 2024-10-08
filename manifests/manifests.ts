import { AuthenticationUiLibrary, Manifest } from "@/manifests/types"
import { Address } from "viem"

import { env } from "@/config/env"

const manifest: Manifest = {
  marketplaceName: "Marketplace",
  contractAddress: env.NEXT_PUBLIC_CONTRACT_ADDRESS.split(",") as Address[],
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
  useNativeTokenForOrders: true,
  // The ERC20 token used if useNativeTokenForOrders is false
  erc20: {
    coinGeckoId: "token_id", // Used to display the fiat price of the token. You can find the id on CoinGecko
    name: "My Token",
    symbol: "MTK",
    address: "0x42f671d85624b835f906d3aacc47745795e4b4f8",
    decimals: 18,
    // put your logo in the '/public/tokens' folder and update the following line (example: "mytoken.png")
    thumb: "",
  },
  // Optional for development but strongly recommended for production use
  rpcUrl: env.NEXT_PUBLIC_RPC_URL,
  // Set to true if contracts transactions are sponsored for Cometh Connect users.
  // Contracts to sponsor are your ERC721, 0x exchange and either the wrapped native token contract or your ERC20
  areContractsSponsored: false,
  walletConnectProjectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,

  fiatCurrency: {
    enable: true, // set to false to disable fiat currency
    currencyId: "usd", // all currencies can be found in the currencies.ts file
    currencySymbol: "$", // symbol to display after the amount
  },
  authenticationUiType: AuthenticationUiLibrary.RAINBOW_KIT,
  collectionSettingsByAddress: {
    "0xfb1a1788471f86399f4bdb1ecfd88c774e21db27": {
      floorPriceAttributeTypes: ["Logo"],
    },
  },
}

export { manifest }
