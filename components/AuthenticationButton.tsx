import { useOpenLoginModal } from "@/providers/authentication/authenticationUiSwitch"
import { cx } from "class-variance-authority"
import { UserIcon, Wallet } from "lucide-react"
import { useWindowSize } from "usehooks-ts"
import { useAccount } from "wagmi"

import { cn } from "@/lib/utils/utils"

import { CurrentAccountDropdown } from "./account-dropdown/CurrentAccountDropdown"
import { Button } from "./ui/Button"
import { Link } from "./ui/Link"

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

  const { width } = useWindowSize()
  const isMobile = width < 640

  if (account.isConnected && !children)
    return (
      <>
        <CurrentAccountDropdown />
        <Link href={`/profile/${account.address}`}>
          <Button className="ml-3" size={isMobile ? "icon" : "default"}>
            <UserIcon className={cn(!isMobile && "mr-2")} size="18" />
            {!isMobile && "Profile"}
          </Button>
        </Link>
      </>
    )

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
