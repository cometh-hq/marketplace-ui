import { useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"

import { useIsConnecting } from "@/lib/web3/auth"
import { useIsConnecting } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"

import { SigninDropdown } from "./account-dropdown/signin-dropdown"
import { CurrentAccountDropdown } from "./account-dropdown/current-account-dropdown"
import { useWalletConnect } from "@/services/web3/use-wallet-connect"
import { SigninDropdown } from "./account-dropdown/signin-dropdown"
import { CurrentAccountDropdown } from "./account-dropdown/current-account-dropdown"
import { useWalletConnect } from "@/services/web3/use-wallet-connect"

export function ConnectButton({ children }: { children?: React.ReactNode }) {
  const { initOnboard, isConnected, setIsconnected, reconnecting, comethWalletAddress } =
    useWeb3OnboardContext()
  const { connect: connectWallet, connecting } = useWalletConnect()
  const [isLoading, setIsLoading] = useState(false)

  async function handleConnect(isComethWallet = false) {
    setIsLoading(true)
    try {
      initOnboard({
        isComethWallet,
        ...(comethWalletAddress && { walletAddress: comethWalletAddress }),
      })
      await connectWallet({ isComethWallet })
      setIsconnected(true)
    } catch (e) {
      console.error("Error connecting wallet", e)
    } finally {
      setIsLoading(false)
    }
  }

  if (isConnected && !children)
    return <CurrentAccountDropdown />

  if (reconnecting) {
    return <Button isLoading={reconnecting} disabled={reconnecting}>Reconnecting</Button>
  }

  if (!isConnected || isLoading || connecting) {
    return (
      <SigninDropdown handleConnect={handleConnect} disabled={isLoading || connecting} />
    )
  }

  return <>{children}</>
}
