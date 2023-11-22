import { manifest } from "@/manifests"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: `${manifest.name}`,
  description: `Discover ${manifest.name}, the ultimate Web3 marketplace platform.`,
  mainNav: [
    {
      title: "Primary sales",
      href: "/",
    },
    {
      title: "Marketplace",
      href: "/marketplace",
    },
  ],
}

export const COMETH_CONNECT_STORAGE_LABEL = "Connect SDK"