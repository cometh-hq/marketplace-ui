import { useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useConnect } from "@/services/web3/use-connect"

import { useIsConnecting } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"

import { CurrentAccountDropdown } from "./account-dropdown/current-account-dropdown"
import { SigninDropdown } from "./account-dropdown/signin-dropdown"

export function ConnectButton({ children }: { children?: React.ReactNode }) {
  const { isConnected, setIsconnected, reconnecting, storeWalletAddress } =
    useWeb3OnboardContext()
  const { connect } = useConnect()
  const isConnecting = useIsConnecting()
  const [isLoading, setIsLoading] = useState(false)

  if (isConnected && !children) return <CurrentAccountDropdown />

  async function handleConnect(isComethWallet = false) {
    setIsLoading(true)
    try {
      await connect({
        isComethWallet,
        existingWalletAddress: storeWalletAddress,
      })
      setIsconnected(true)
    } catch (e) {
      console.error("Error connecting wallet", e)
    } finally {
      setIsLoading(false)
    }
  }

  if (reconnecting) {
    return <Button>Reconnecting...</Button>
  }

  if (!isConnected || isLoading) {
    const label = isConnecting ? "Connecting..." : "Signin"

    return <SigninDropdown label={label} handleConnect={handleConnect} />
  }

  return <>{children}</>
}
