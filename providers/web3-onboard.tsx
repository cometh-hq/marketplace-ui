import { useMemo } from "react"

import "@web3-onboard/common"
import { manifest } from "@/manifests"
import injectedModule from "@web3-onboard/injected-wallets"
import { Web3OnboardProvider, init } from "@web3-onboard/react"

const injected = injectedModule()

export function Web3Onboard({ children }: { children: React.ReactNode }) {
  const config = useMemo(
    () =>
      init({
        wallets: [injected],
        chains: [
          {
            id: "0x89",
            token: "MATIC",
            label: "Polygon",
          },
        ],
        appMetadata: {
          name: manifest.name,
          description: "Description",
          icon: "/cometh16x16.svg",
          logo: "/fulllogo.svg",
          recommendedInjectedWallets: [
            { name: "MetaMask", url: "https://metamask.io" },
          ],
        },
        connect: {
          autoConnectLastWallet: true,
        },
        theme: manifest.web3Onboard?.theme,
        accountCenter: {
          desktop: {
            enabled: true,
          },
          mobile: {
            enabled: true,
          },
        },
      }),
    [manifest.name, manifest.web3Onboard?.theme]
  )

  return (
    <Web3OnboardProvider web3Onboard={config}>{children}</Web3OnboardProvider>
  )
}
