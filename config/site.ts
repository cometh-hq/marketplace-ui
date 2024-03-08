import { manifest } from "@/manifests/manifests"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: `${manifest.marketplaceName}`,
  description: `Discover ${manifest.marketplaceName}, the ultimate Web3 marketplace platform.`,
  mainNav: [],
}

export const COMETH_CONNECT_STORAGE_LABEL = "Connect SDK"
