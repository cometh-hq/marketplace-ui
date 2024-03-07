import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"

export function MarketplaceRainbowKitProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <RainbowKitProvider>{children}</RainbowKitProvider>
}
