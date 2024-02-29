import { manifest } from "@/manifests"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: `${manifest.collectionName}`,
  description: `Discover ${manifest.collectionName}, the ultimate Web3 marketplace platform.`,
  mainNav: [
    {
      title: "Marketplace",
      subtitle: " (Alpha)",
      href: "/marketplace",
    },
  ],
}

export const COMETH_CONNECT_STORAGE_LABEL = "Connect SDK"
