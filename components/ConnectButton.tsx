import { useAccount } from "wagmi"

import { CurrentAccountDropdown } from "./account-dropdown/CurrentAccountDropdown"
import { SigninDropdown } from "./account-dropdown/SigninDropdown"
import { ButtonLoading } from "./ButtonLoading"

export function ConnectButton({
  children,
  fullVariant = false,
  customText = undefined,
}: {
  children?: React.ReactNode
  fullVariant?: boolean
  customText?: string
}) {
  const account = useAccount()

  if (account.isConnected && !children) return <CurrentAccountDropdown />

  if (account.isReconnecting) {
    return (
      <ButtonLoading size={fullVariant ? "lg" : "default"} isLoading disabled />
    )
  }

  if (!account.isConnected && !account.isReconnecting) {
    return (
      <SigninDropdown
        disabled={account.isConnecting}
        fullVariant={fullVariant}
        customText={customText}
      />
    )
  }

  return <>{children}</>
}
