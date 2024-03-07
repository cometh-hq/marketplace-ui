import "@rainbow-me/rainbowkit/styles.css"

import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import tailwindConfig from "tailwind.config"
import resolveConfig from "tailwindcss/resolveConfig"

const fullConfig = resolveConfig(tailwindConfig)

export function MarketplaceRainbowKitProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = lightTheme({
    accentColor: fullConfig.theme.colors.primary.DEFAULT,
    accentColorForeground: fullConfig.theme.colors.primary.foreground,
    borderRadius: "medium",
    fontStack: "system",
    overlayBlur: 'small',
  })
  return <RainbowKitProvider theme={theme}>{children}</RainbowKitProvider>
}
