import { manifest } from "@/manifests"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: `${manifest.name}`,
  description: `Discover ${manifest.name}, the ultimate Web3 marketplace platform.`,
  mainNav: [
    {
      title: "Marketplace",
      href: "/marketplace",
    },
  ],
}

export const COMETH_CONNECT_STORAGE_LABEL = "Connect SDK"

export const SUPPORTED_NETWORKS = [
  {
    id: "0x89",
    token: "MATIC",
    label: "Polygon",
  },
  {
    id: "0x13881",
    token: "MATIC",
    label: "Mumbai",
  },
  {
    id: "0x64",
    token: "XDAI",
    label: "Gnosis",
  },
  {
    id: "0xa86a",
    token: "Avax",
    label: "Avalanche",
  },
  {
    id: "0x1",
    token: "ETH",
    label: "Ethereum Mainnet",
  },
  {
    id: "0x38",
    token: "BNB",
    label: "BNB",
  },
  {
    id: "0xa4ec",
    token: "CELO",
    label: "Celo",
  },
  {
    id: "0xfa",
    token: "FTM",
    label: "Fantom Opera",
  },
  {
    id: "0x504",
    token: "GLMR",
    label: "Moonbeam",
  },
  {
    id: "0x505",
    token: "MOVR",
    label: "Moonriver",
  },
  {
    id: "0x19",
    token: "CRO",
    label: "Cronos",
  },
  {
    id: "0xa",
    token: "ETH",
    label: "OP Mainnet",
  },
  {
    id: "0xa4b1",
    token: "ETH",
    label: "Arbitrum One",
  },
  {
    id: "0xa4ba",
    token: "ETH",
    label: "Arbitrum Nova",
  },
  {
    id: "0x44d",
    token: "ETH",
    label: "Polygon zKEVM",
  },
  {
    id: "0x2105",
    token: "ETH",
    label: "Base",
  },
]