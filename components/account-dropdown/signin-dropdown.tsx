"use client"

import { useCallback, useEffect, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useCosmikSignin, User } from "@/services/cosmik/signin"
import { useStorageWallet } from "@/services/web3/use-storage-wallet"
import { useWalletConnect } from "@/services/web3/use-wallet-connect"
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
  fullVariant?: boolean
  customText?: string
  isLinkVariant?: boolean
}

export function SigninDropdown({
  disabled,
  fullVariant,
  customText,
  isLinkVariant,
}: SigninDropdownProps) {
  const { initOnboard, setIsconnected, retrieveWalletAddressFromSigner } =
    useWeb3OnboardContext()
  const [user, setUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSigninDropdownOpen, setIsSigninDropdownOpen] = useState(false)
  const { isSuccess, isPending, data } = useCosmikSignin()
  const { connect: connectWallet } = useWalletConnect()
  const [isLoading, setIsLoading] = useState(false)

  const handleDropdownOpenChange = useCallback(
    (open: boolean) => {
      if (!open || !isModalOpen) {
        setIsSigninDropdownOpen(open)
      }
    },
    [isModalOpen]
  )

  const handleLoginSuccess = useCallback(
    async (user: User) => {
      try {
        setIsLoading(true)
        setUser(user)
        // Attempt to retrieve the wallet address to determine if it is the first connection
        await retrieveWalletAddressFromSigner(user.address)
        localStorage.setItem("hasRetrieveWalletAddress", "true")
        initOnboard({
          isComethWallet: true,
          walletAddress: user.address,
        })
        await connectWallet({ isComethWallet: true })
        setIsconnected(true)
      } catch (error) {
        // If an error occurs, likely due to a first-time connection, display the authorization modal
        setIsSigninDropdownOpen(false)
        setIsModalOpen(true)
      } finally {
        setIsLoading(false)
      }
    },
    [user]
  )

  useEffect(() => {
    if (isSuccess) {
      handleLoginSuccess(data.user)
    }
  }, [isSuccess, handleLoginSuccess])

  return (
    <>
      <DropdownMenu
        open={isSigninDropdownOpen}
        onOpenChange={handleDropdownOpenChange}
      >
        <DropdownMenuTrigger asChild>
          <Button
            className={cx({
              "h-12 w-full": fullVariant,
            })}
            // variant={isLinkVariant ? "link" : "default"}
            disabled={disabled || isPending}
            isLoading={disabled || isPending}
          >
            {!isLinkVariant && <WalletIcon size="16" className="mr-2" />}
            {customText ? customText : "Login"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent variant="dialog" align="end" asChild>
          <Card className="mt-1 p-4" style={{ width: "324px" }}>
            <CardContent className="space-y-3 p-0">
              <p>
                To access the marketplace and trade cards, please log in with
                your Cosmik Battle credentials. <br />
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
              <SignInForm
                onLoginSuccess={handleLoginSuccess}
                isDisabled={disabled || isLoading}
              />
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
      {isModalOpen && user && (
        <AuthorizationProcess
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={user}
        />
      )}
    </>
  )
}
