import { useCallback, useState } from "react"
import { LogInIcon, UserIcon } from "lucide-react"
import { useWindowSize } from "usehooks-ts"
import { useAccount } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { cn } from "@/lib/utils/utils"

import { CurrentAccountDropdown } from "../account-dropdown/CurrentAccountDropdown"
import { Button } from "../ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog"
import { Link } from "../ui/Link"
import { BiometricLoginButton } from "./BiometricLoginButton"
import { TraditionalWalletsButton } from "./TraditionalWalletsButton"

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
  const [open, setOpen] = useState(false)

  const { width } = useWindowSize()
  const isMobile = width < 640

  const closeModal = useCallback(() => {
    setOpen(false)
  }, [])

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
    return globalConfig.isComethConnectEnabled ? (
      <div className="relative">
        <Dialog open={open} onOpenChange={setOpen} modal>
          <DialogTrigger asChild>
            <Button
              size={isMobile ? "icon" : "default"}
              isLoading={account.isReconnecting || account.isConnecting}
              disabled={account.isReconnecting || account.isConnecting}
            >
              {customText ? (
                customText
              ) : (
                <>
                  <LogInIcon className={cn(!isMobile && "mr-2")} size="18" />
                  Login
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[350px]">
            <DialogHeader>
              <DialogTitle className="flex">
                <LogInIcon className="mr-2" /> Login{" "}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <BiometricLoginButton onPreClick={closeModal} />
              <TraditionalWalletsButton
                onPreClick={closeModal}
                fullVariant={fullVariant}
                customText={customText}
                dropDownVersion
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    ) : (
      <TraditionalWalletsButton
        fullVariant={fullVariant}
        customText={customText}
      />
    )
  }

  return children
}
