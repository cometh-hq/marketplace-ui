import { useCallback } from "react"
import { useOpenLoginModal } from "@/providers/authentication/authenticationUiSwitch"
import { cx } from "class-variance-authority"
import { Wallet } from "lucide-react"
import { useAccount } from "wagmi"

import { Button } from "../ui/Button"

export const TraditionalWalletsButton = ({
  fullVariant = false,
  customText = undefined,
  dropDownVersion = false,
  onPreClick = () => {},
}: {
  fullVariant?: boolean
  customText?: string
  dropDownVersion?: boolean
  onPreClick?: () => void
}) => {
  const account = useAccount()
  const openLoginModal = useOpenLoginModal()

  const onButtonClick = useCallback(() => {
    onPreClick()
    openLoginModal && openLoginModal()
  }, [onPreClick, openLoginModal])

  return (
    <Button
      onClick={onButtonClick}
      isLoading={account.isReconnecting}
      disabled={account.isReconnecting}
      className={cx({
        "h-12 w-full ": fullVariant,
      })}
      size={dropDownVersion ? "lg" : "default"}
    >
      {customText && !dropDownVersion ? (
        customText
      ) : (
        <>
          <Wallet className="mr-2" size="20" />
          Wallet {dropDownVersion && "login"}
        </>
      )}
    </Button>
  )
}
