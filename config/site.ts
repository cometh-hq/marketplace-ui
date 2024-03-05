import { manifest } from "@/manifests"

import globalConfig from "./globalConfig"

let mainNav = [
  {
    title: "Marketplace",
    href: "/marketplace",
  },
]

if (globalConfig.contractAddresses.length > 1) {
  mainNav = []
}

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: `${manifest.marketplaceName}`,
  description: `Discover ${manifest.marketplaceName}, the ultimate Web3 marketplace platform.`,
  mainNav,
}

export const COMETH_CONNECT_STORAGE_LABEL = "Connect SDK"
