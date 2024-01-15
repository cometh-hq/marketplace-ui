import { Address } from "viem"

export type NetworkConfig = {
  chainId: number
  hexaId: string
  name: string
  chain: string
  network: string
  explorer: {
    name: string
    url: string
    standard: string
  } | null
  nativeToken: {
    name: string
    symbol: string
    decimals: number
    thumb?: string
  }
  wrappedNativeToken: {
    name: string
    symbol: string
    address: Address
    thumb?: string
  }
  zeroExExchange: Address
}

const NETWORKS: Record<number, NetworkConfig> = {
  1: {
    chainId: 1,
    hexaId: "0x1",
    name: "Ethereum Mainnet",
    chain: "ETH",
    network: "mainnet",
    explorer: {
      name: "etherscan",
      url: "https://etherscan.io",
      standard: "EIP3091",
    },
    nativeToken: { name: "Ether", symbol: "ETH", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  3: {
    chainId: 3,
    hexaId: "0x3",
    name: "Ethereum Testnet Ropsten",
    chain: "ETH",
    network: "ropsten",
    explorer: null,
    nativeToken: { name: "Ropsten Ether", symbol: "ROP", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Ropsten Ether",
      symbol: "WROP",
      address: "0xc778417e063141139fce010982780140aa0cd5ab",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  4: {
    chainId: 4,
    hexaId: "0x4",
    name: "Ethereum Testnet Rinkeby",
    chain: "ETH",
    network: "rinkeby",
    explorer: {
      name: "etherscan-rinkeby",
      url: "https://rinkeby.etherscan.io",
      standard: "EIP3091",
    },
    nativeToken: { name: "Rinkeby Ether", symbol: "RIN", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Rinkeby Ether",
      symbol: "WRIN",
      address: "0xc778417e063141139fce010982780140aa0cd5ab",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  5: {
    chainId: 5,
    hexaId: "0x5",
    name: "Ethereum Testnet Görli",
    chain: "ETH",
    network: "goerli",
    explorer: null,
    nativeToken: { name: "Görli Ether", symbol: "GOR", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Görli Ether",
      symbol: "WGOR",
      address: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
    },
    zeroExExchange: "0xf91bb752490473b8342a3e964e855b9f9a2a668e",
  },
  8: {
    chainId: 8,
    hexaId: "0x8",
    name: "Ubiq",
    chain: "UBQ",
    network: "mainnet",
    explorer: {
      name: "ubiqscan",
      url: "https://ubiqscan.io",
      standard: "EIP3091",
    },
    nativeToken: { name: "Ubiq Ether", symbol: "UBQ", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Ubiq Ether",
      symbol: "WUBQ",
      address: "0x1FA6A37c64804C0D797bA6bC1955E50068FbF362",
    },
    zeroExExchange: "0x19aaD856cE8c4C7e813233b21d56dA97796cC052",
  },
  10: {
    chainId: 10,
    hexaId: "0xa",
    name: "Optimistic Ethereum",
    chain: "ETH",
    network: "mainnet",
    explorer: null,
    nativeToken: { name: "Ether", symbol: "OETH", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Ether",
      symbol: "WOETH",
      address: "0x4200000000000000000000000000000000000006",
    },
    zeroExExchange: "0xdef1abe32c034e558cdd535791643c58a13acc10",
  },
  42: {
    chainId: 42,
    hexaId: "0x2a",
    name: "Ethereum Testnet Kovan",
    chain: "ETH",
    network: "kovan",
    explorer: null,
    nativeToken: { name: "Kovan Ether", symbol: "KOV", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Kovan Ether",
      symbol: "WKOV",
      address: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  56: {
    chainId: 56,
    hexaId: "0x38",
    name: "Binance Smart Chain Mainnet",
    chain: "BSC",
    network: "mainnet",
    explorer: {
      name: "bscscan",
      url: "https://bscscan.com",
      standard: "EIP3091",
    },
    nativeToken: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    wrappedNativeToken: {
      name: "Wrapped Binance Chain Native Token",
      symbol: "WBNB",
      address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  137: {
    chainId: 137,
    hexaId: "0x89",
    name: "Matic(Polygon) Mainnet",
    chain: "Matic(Polygon)",
    network: "mainnet",
    explorer: {
      name: "polygonscan",
      url: "https://polygonscan.com",
      standard: "EIP3091",
    },
    nativeToken: { name: "Matic", symbol: "MATIC", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Matic",
      symbol: "WMATIC",
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  250: {
    chainId: 250,
    hexaId: "0xfa",
    name: "Fantom Opera",
    chain: "FTM",
    network: "mainnet",
    explorer: {
      name: "ftmscan",
      url: "https://ftmscan.com",
      standard: "EIP3091",
    },
    nativeToken: { name: "Fantom", symbol: "FTM", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Fantom",
      symbol: "WFTM",
      address: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    },
    zeroExExchange: "0xdef189deaef76e379df891899eb5a00a94cbc250",
  },
  42161: {
    chainId: 42161,
    hexaId: "0xa4b1",
    name: "Arbitrum One",
    chain: "ETH",
    network: "mainnet",
    explorer: {
      name: "Arbiscan",
      url: "https://arbiscan.io",
      standard: "EIP3091",
    },
    nativeToken: { name: "Ether", symbol: "AETH", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Ether",
      symbol: "WAETH",
      address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  42220: {
    chainId: 42220,
    hexaId: "0xa4ec",
    name: "Celo Mainnet",
    chain: "CELO",
    network: "Mainnet",
    explorer: null,
    nativeToken: { name: "CELO", symbol: "CELO", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped CELO",
      symbol: "WCELO",
      address: "0x471EcE3750Da237f93B8E339c536989b8978a438",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  43114: {
    chainId: 43114,
    hexaId: "0xa86a",
    name: "Avalanche Mainnet",
    chain: "AVAX",
    network: "mainnet",
    explorer: null,
    nativeToken: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Avalanche",
      symbol: "WAVAX",
      address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  80001: {
    chainId: 80001,
    hexaId: "0x13881",
    name: "Matic(Polygon) Testnet Mumbai",
    chain: "Matic(Polygon)",
    network: "testnet",
    explorer: {
      name: "polygonscan",
      url: "https://mumbai.polygonscan.com/",
      standard: "EIP3091",
    },
    nativeToken: {
      name: "Matic",
      symbol: "tMATIC",
      decimals: 18,
      thumb: "matic.png",
    },
    wrappedNativeToken: {
      name: "Wrapped Matic",
      symbol: "WtMATIC",
      address: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
      thumb: "wmatic.png",
    },
    zeroExExchange: "0x4fb72262344034e034fce3d9c701fd9213a55260",
  },
  2121337: {
    chainId: 2121337,
    hexaId: "0x205E79",
    name: "Muster Testnet",
    chain: "Muster",
    network: "testnet",
    explorer: {
      name: "muster blockscout",
      url: "https://muster-anytrust-explorer.alt.technology/",
      standard: "EIP3091",
    },
    nativeToken: { name: "Muster", symbol: "MUST", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Muster",
      symbol: "WMUST",
      address: "0xd9eF5BE1AB8AC56325eDd51f995BBCa0eBE7D9e8",
    },
    zeroExExchange: "0x9a6204dE86443eB0914059b291f667D8953e8aE1",
  },
}

export default NETWORKS
