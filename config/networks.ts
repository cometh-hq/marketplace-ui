import { Address, parseEther } from "viem"

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
    blockUrl?: string
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
    decimals: number
    thumb?: string
  }
  zeroExExchange: Address
  // Don't hesitate to update this value as you see fit
  minimumBalanceForGas: bigint
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
      blockUrl: "https://etherscan.io/block",
    },
    nativeToken: { name: "Ether", symbol: "ETH", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    minimumBalanceForGas: parseEther("0.001"),
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
      decimals: 18,
      address: "0xc778417e063141139fce010982780140aa0cd5ab",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    minimumBalanceForGas: parseEther("0.001"),
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
      decimals: 18,
      address: "0xc778417e063141139fce010982780140aa0cd5ab",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    minimumBalanceForGas: parseEther("0.001"),
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
      decimals: 18,
      address: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
    },
    zeroExExchange: "0xf91bb752490473b8342a3e964e855b9f9a2a668e",
    minimumBalanceForGas: parseEther("0.001"),
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
      decimals: 18,
      address: "0x1FA6A37c64804C0D797bA6bC1955E50068FbF362",
    },
    zeroExExchange: "0x19aaD856cE8c4C7e813233b21d56dA97796cC052",
    minimumBalanceForGas: parseEther("1"),
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
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
    },
    zeroExExchange: "0xdef1abe32c034e558cdd535791643c58a13acc10",
    minimumBalanceForGas: parseEther("0.001"),
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
      decimals: 18,
      address: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    minimumBalanceForGas: parseEther("1"),
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
      blockUrl: "https://bscscan.com/block",
    },
    nativeToken: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    wrappedNativeToken: {
      name: "Wrapped Binance Chain Native Token",
      symbol: "WBNB",
      decimals: 18,
      address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    minimumBalanceForGas: parseEther("1"),
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
      blockUrl: "https://polygonscan.com/tx",
    },
    nativeToken: { name: "Matic", symbol: "MATIC", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Matic",
      symbol: "WMATIC",
      decimals: 18,
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    minimumBalanceForGas: parseEther("0.1"),
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
      blockUrl: "https://ftmscan.com/block",
    },
    nativeToken: { name: "Fantom", symbol: "FTM", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Fantom",
      symbol: "WFTM",
      decimals: 18,
      address: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    },
    zeroExExchange: "0xdef189deaef76e379df891899eb5a00a94cbc250",
    minimumBalanceForGas: parseEther("1"),
  },
  42161: {
    chainId: 42161,
    hexaId: "0xa4b1",
    name: "Arbitrum One",
    chain: "ETH",
    network: "mainnet",
    explorer: {
      name: "Arbiscan",
      url: "https://arbiscan.io/",
      standard: "EIP3091",
      blockUrl: "https://arbiscan.io/block",
    },
    nativeToken: { name: "Ether", symbol: "AETH", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Ether",
      symbol: "WAETH",
      decimals: 18,
      address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    minimumBalanceForGas: parseEther("1"),
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
      decimals: 18,
      address: "0x471EcE3750Da237f93B8E339c536989b8978a438",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    minimumBalanceForGas: parseEther("1"),
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
      decimals: 18,
      address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    minimumBalanceForGas: parseEther("1"),
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
      blockUrl: "https://mumbai.polygonscan.com/tx",
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
      decimals: 18,
      address: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
      thumb: "wmatic.png",
    },
    zeroExExchange: "0xf471d32cb40837bf24529fcf17418fc1a4807626",
    minimumBalanceForGas: parseEther("0.1"),
  },
  4078: {
    chainId: 4078,
    hexaId: "0xfee",
    name: "Muster Mainnet",
    chain: "Muster",
    network: "mainnet",
    explorer: {
      name: "Muster",
      url: " https://muster-explorer.alt.technology/",
      standard: "EIP3091",
      blockUrl: "https://muster-explorer.alt.technology/tx",
    },
    nativeToken: { name: "Ether", symbol: "ETH", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped ETH",
      symbol: "WETH",
      decimals: 18,
      address: "0x869Bf8814d77106323745758135b999D34C79a87",
    },
    zeroExExchange: "0x156980A14810259B08D3B8e8412274c479c09832",
    minimumBalanceForGas: parseEther("0.01"),
  },
  2121337: {
    chainId: 2121337,
    hexaId: "0x205E79",
    name: "Muster Testnet",
    chain: "Muster",
    network: "testnet",
    explorer: {
      name: "muster blockscout",
      url: "https://muster-anytrust-explorer.alt.technology",
      standard: "EIP3091",
      blockUrl: "https://muster-anytrust-explorer.alt.technology/tx",
    },
    nativeToken: { name: "Ether", symbol: "ETH", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped ETH",
      symbol: "WETH",
      decimals: 18,
      address: "0xd9eF5BE1AB8AC56325eDd51f995BBCa0eBE7D9e8",
    },
    zeroExExchange: "0x9a6204dE86443eB0914059b291f667D8953e8aE1",
    minimumBalanceForGas: parseEther("0.01"),
  },
}

export default NETWORKS
