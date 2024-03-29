import { cx } from "class-variance-authority"
import { Wallet } from "lucide-react"
import { useAccount } from "wagmi"

import { CurrentAccountDropdown } from "./account-dropdown/CurrentAccountDropdown"
import { Button } from "./ui/Button"
import { useOpenLoginModal } from "@/providers/authentication/authenticationUiSwitch"


export function AuthenticationButton({
  children,
  fullVariant = false,
  customText = undefined,
}: {
  children?: React.ReactNode
  fullVariant?: boolean
  customText?: string
}) {
  const account = useAccount()
  const openLoginModal = useOpenLoginModal()

  if (account.isConnected && !children) return <CurrentAccountDropdown />

  if (!account.isConnected) {
    return (
      <Button
        onClick={() => openLoginModal && openLoginModal()}
        isLoading={account.isReconnecting}
        disabled={account.isReconnecting}
        className={cx({
          "h-12 w-full": fullVariant,
        })}
      >
        {customText ? (
          customText
        ) : (
          <>
            <Wallet className="mr-2" size="20" />
            Login
          </>
        )}
      </Button>
    )
  }

  return children
}
