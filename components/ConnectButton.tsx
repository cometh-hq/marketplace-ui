import { useAccount } from "wagmi"

import { Button } from "@/components/ui/Button"

import { CurrentAccountDropdown } from "./account-dropdown/CurrentAccountDropdown"
import { SigninDropdown } from "./account-dropdown/SigninDropdown"

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
  const account = useAccount()

  if (account.isConnected && !children) return <CurrentAccountDropdown />

  if (account.isReconnecting && !isLinkVariant) {
    return (
      <Button size={fullVariant ? "lg" : "default"} isLoading disabled>
        Reconnecting
      </Button>
    )
  }

  if (!account.isConnected && !account.isReconnecting) {
    return (
      <SigninDropdown
        disabled={account.isConnecting}
        fullVariant={fullVariant}
        customText={customText}
        isLinkVariant={isLinkVariant}
      />
    )
  }

  return <>{children}</>
}
