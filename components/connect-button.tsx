import { useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useStorageWallet } from "@/services/web3/use-storage-wallet"
import { useWalletConnect } from "@/services/web3/use-wallet-connect"

import { useIsConnecting } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"

import { CurrentAccountDropdown } from "./account-dropdown/current-account-dropdown"
import { SigninDropdown } from "./account-dropdown/signin-dropdown"

export function ConnectButton({
  children,
  fullVariant = false,
}: {
  children?: React.ReactNode
  fullVariant?: boolean
}) {
  const { initOnboard, isConnected, setIsconnected, reconnecting } =
    useWeb3OnboardContext()
  const { connect: connectWallet, connecting } = useWalletConnect()
  const [isLoading, setIsLoading] = useState(false)
  const { comethWalletAddressInStorage } = useStorageWallet()

  async function handleConnect(isComethWallet = false) {
    setIsLoading(true)
    try {
      initOnboard({
        isComethWallet,
        ...(comethWalletAddressInStorage && {
          walletAddress: comethWalletAddressInStorage,
        }),
      })

      await connectWallet({ isComethWallet })
      setIsconnected(true)
    } catch (error) {
      console.error("Error connecting wallet", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isConnected && !children) return <CurrentAccountDropdown />

  if (reconnecting) {
    return (
      <Button
        size={fullVariant ? "lg" : "default"}
        isLoading={reconnecting}
        disabled={reconnecting}
      >
        Reconnecting
      </Button>
    )
  }

  if (!isConnected || isLoading || connecting) {
    return (
      <SigninDropdown
        handleConnect={handleConnect}
        disabled={isLoading || connecting}
        fullVariant={fullVariant}
      />
    )
  }

  return <>{children}</>
}
