"use client"

import { useCallback, useEffect, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useCosmikSignin } from "@/services/cosmik/signin"
import { cx } from "class-variance-authority"
import { WalletIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignInForm } from "@/components/signin/signin-form"

import { AddNewDeviceDialog } from "../ui/modal-add-new-device"
import { AuthorizationProcess } from "../connect-actions/buttons/authorization-process"

export type SigninDropdownProps = {
  disabled: boolean
  handleConnect: (isComethWallet: boolean) => Promise<void>
  fullVariant?: boolean
  customText?: string
  isLinkVariant?: boolean
}

export type User = {
  id: string
  address: string
  userName: string
  email: string
  coins: number
  aurium: number
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

  const handleLoginSuccess = useCallback(
    (user: User) => {
      // setIsLoggedIn(true)
      setUser(user)
      console.log("user", user)
      // Tentative de récupération de l'adresse du portefeuille pour vérifier si c'est la première connexion
      retrieveWalletAddressFromSigner(user.address)
        .catch(() => {
          // En cas d'erreur, probablement une première connexion, afficher la modale d'autorisation
          setIsModalOpen(true)
        })
        .finally(() => {
          // Après avoir géré la récupération de l'adresse, tentez de connecter automatiquement au wallet Cometh Connect
          handleConnect(true)
        })
    },
    [retrieveWalletAddressFromSigner]
  )

  useEffect(() => {
    if (isSuccess) {
      handleLoginSuccess(data.user)
      // setWalletsRendered(true)
    }
  }, [isSuccess, handleLoginSuccess])

  // const handleLogout = () => {
  //   localStorage.removeItem("user")
  //   setUser(null)
  //   setIsLoggedIn(false)
  //   setWalletsRendered(false)
  // }

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
          {isModalOpen && (
            <AuthorizationProcess isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={user} />
            // <AddNewDeviceDialog
            //   setIsOpen={setIsModalOpen}
            //   onClose={handleModalOpen}
            // ></AddNewDeviceDialog>
          )}
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
