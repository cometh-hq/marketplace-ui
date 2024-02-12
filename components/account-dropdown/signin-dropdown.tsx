"use client"

import { useCallback, useEffect, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { User, useCosmikSignin } from "@/services/cosmik/signin"
import { useStorageWallet } from "@/services/web3/use-storage-wallet"
import { cx } from "class-variance-authority"
import { WalletIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthorizationProcess } from "@/components/connect-actions/buttons/authorization-process"
import { SignInForm } from "@/components/signin/signin-form"

export type SigninDropdownProps = {
  disabled: boolean
  handleConnect: (isComethWallet: boolean) => Promise<void>
  fullVariant?: boolean
  customText?: string
  isLinkVariant?: boolean
}

export function SigninDropdown({
  disabled,
  handleConnect,
  fullVariant,
  customText,
  isLinkVariant,
}: SigninDropdownProps) {
  const { retrieveWalletAddressFromSigner } = useWeb3OnboardContext()
  const [user, setUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { isSuccess, data } = useCosmikSignin()
  const { comethWalletAddressInStorage } = useStorageWallet()

  const handleLoginSuccess = useCallback(
    (user: User) => {
      setUser(user)
      // Attempt to retrieve the wallet address to determine if it is the first connection
      retrieveWalletAddressFromSigner(user.address)
        .catch(() => {
          // If an error occurs, likely due to a first-time connection, display the authorization modal
          setIsModalOpen(true)
        })
        .finally(() => {
          handleConnect(true)
        })
    },
    [retrieveWalletAddressFromSigner]
  )

  useEffect(() => {
    if (isSuccess) {
      handleLoginSuccess(data.user)
    }
  }, [isSuccess, handleLoginSuccess])

  if (comethWalletAddressInStorage) {
    return (
      <Button
        className={cx({
          "h-12 w-full": fullVariant,
        })}
        variant={isLinkVariant ? "link" : "default"}
        disabled={disabled}
        isLoading={disabled}
        onClick={() => handleConnect(true)}
      >
        {!isLinkVariant && <WalletIcon size="16" className="mr-2" />}
        {customText ? customText : "Login"}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cx({
            "h-12 w-full": fullVariant,
          })}
          variant={isLinkVariant ? "link" : "default"}
          disabled={disabled}
          isLoading={disabled}
        >
          {!isLinkVariant && <WalletIcon size="16" className="mr-2" />}
          {customText ? customText : "Login"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent variant="dialog" align="end" asChild>
        <Card className="mt-1 p-4" style={{ width: "324px" }}>
          <CardContent className="space-y-3 p-0">
            <p>
              To access the marketplace and trade cards, please log in with your
              Cosmik Battle credentials. <br />
              No account?{" "}
              <a
                href="https://store.epicgames.com/fr/p/cosmik-battle-f6dbf4"
                className="font-medium underline"
                target="_blank"
                rel="noreferrer"
              >
                Download Cosmik Battle
              </a>
            </p>
            <SignInForm onLoginSuccess={handleLoginSuccess} />
          </CardContent>
          {isModalOpen && user && (
            <AuthorizationProcess
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              user={user}
            />
          )}
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
