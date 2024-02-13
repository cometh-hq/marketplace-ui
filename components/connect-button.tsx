import { useEffect, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useWalletConnect } from "@/services/web3/use-wallet-connect"
import { WalletIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { CurrentAccountDropdown } from "./account-dropdown/current-account-dropdown"
import { SigninDropdown } from "./account-dropdown/signin-dropdown"

export function ConnectButton({
  children,
  fullVariant = false,
  customText = undefined,
  isLinkVariant = undefined,
}: {
  children?: React.ReactNode
  fullVariant?: boolean
  customText?: string
  isLinkVariant?: boolean
}) {
  const { isConnected, setIsconnected, reconnecting } = useWeb3OnboardContext()
  const { connect: connectWallet, connecting } = useWalletConnect()
  const [isLoading, setIsLoading] = useState(false)
  const [userInStorage, setUserInStorage] = useState<string | null>(null)

  useEffect(() => {
    const user = localStorage.getItem("user")
    setUserInStorage(user)    
  }, [])

  async function handleConnect(isComethWallet = false) {
    setIsLoading(true)
    try {
      await connectWallet({ isComethWallet })
      setIsconnected(true)
    } catch (error) {
      console.error("Error connecting wallet", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isConnected && !children) return <CurrentAccountDropdown />

  if (reconnecting && !isLinkVariant) {
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

  if (!userInStorage && (!isConnected || isLoading || connecting)) {
    return (
      <Button
        variant="default"
        size={fullVariant ? "lg" : "default"}
        isLoading={isLoading || connecting || reconnecting}
        disabled={isLoading || connecting || reconnecting}
        onClick={() => handleConnect(true)}
      >
        <WalletIcon size="16" className="mr-2" /> Login
      </Button>
    )
  }

  if (!isConnected || isLoading || connecting) {
    return (
      <SigninDropdown
        disabled={isLoading || connecting || reconnecting}
        fullVariant={fullVariant}
        customText={customText}
        isLinkVariant={isLinkVariant}
      />
    )
  }

  return <>{children}</>
}
