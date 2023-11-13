import { useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useComethConnect } from "@/services/web3/use-cometh-connect"

import { COMETH_CONNECT_LABEL } from "@/config/site"
import { useIsConnecting } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"

import { AccountDropdownButton } from "./account-dropdown/button"

export function ConnectButton({ children }: { children?: React.ReactNode }) {
  const { isConnected, reconnecting } = useWeb3OnboardContext()
  const { connect } = useComethConnect()
  const isConnecting = useIsConnecting()
  const [isLoading, setIsLoading] = useState(false)

  if (isConnected && !children)
    return <AccountDropdownButton variant="default" />

  // if (isFetching) return <ButtonLoading />

  async function handleConnect(isAlembicWallet = false) {
    setIsLoading(true)
    try {
      await connect({
        isAlembicWallet,
      })
    } catch (e) {
      console.error("Erreur lors de la connexion au portefeuille:", e)
    } finally {
      setIsLoading(false)
    }
  }

  if (reconnecting) {
    return <div>Reconnecting...</div>
  }

  if (!isConnected || isLoading) {
    const label = isConnecting ? (
      "Connecting..."
    ) : (
      <>
        Connect&nbsp;<span className="max-md:hidden">wallet</span>
      </>
    )

    return (
      <div className="flex items-center gap-2">
        <Button
          size={children ? "lg" : "default"}
          className="w-full"
          onClick={() => handleConnect(false)}
        >
          {label}
        </Button>
        <button type="button" onClick={() => handleConnect(true)}>
          Connect with cometh
        </button>
      </div>
    )
  }

  return <>{children}</>
}
