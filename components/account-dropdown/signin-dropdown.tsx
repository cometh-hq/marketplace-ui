"use client"

import { useEffect, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useCosmikSignin } from "@/services/cometh-marketplace/cosmik/signin"
import axios from "axios"
import { cx } from "class-variance-authority"
import { WalletIcon } from "lucide-react"

import { env } from "@/config/env"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "../ui/input"
import { AddNewDeviceDialog } from "../ui/modal-add-new-device"
import { AccountWallet } from "./account-wallet"

export type SigninDropdownProps = {
  disabled: boolean
  handleConnect?: (isComethWallet: boolean) => Promise<void>
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
  const wallets = [
    ...(env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY
      ? [
          {
            name: "Cometh Connect",
            icon: `${env.NEXT_PUBLIC_BASE_PATH}/cometh-connect.png`,
            isComethWallet: true,
          },
        ]
      : []),
  ]

  const [email, setEmail] = useState("lorraine.steve@cometh.io")
  const [password, setPassword] = useState("darkVador83!")
  const [signinButton, setSigninButton] = useState("Login")
  const [walletsRendered, setWalletsRendered] = useState(false)
  const { retrieveWalletAddressFromSigner } = useWeb3OnboardContext()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    mutate: signin,
    error,
    isSuccess,
    data,
    isPending,
  } = useCosmikSignin()

  useEffect(() => {
    if (isSuccess && data?.user) {
      console.log("on est dans le isSuccess")
      console.log("data", data)
      setCurrentUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
      // Mettre à jour l'état pour refléter le nom d'utilisateur dans le bouton de connexion
      setSigninButton(data.user.userName)
      setWalletsRendered(true)
      console.log("currentUser", currentUser)
    }
  }, [isSuccess, data])

  useEffect(() => {
    if (error) {
      console.error("Error during signin:", error)
      setIsModalOpen(true)
    }
  }, [error])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setCurrentUser(null)
    setSigninButton("Sign in")
    setWalletsRendered(false)
  }

  const handleProfile = () => {
    if (currentUser) {
      console.log("currentUser", currentUser)
      // const profileUrl = `http://localhost:3001/profile/${currentUser.address}`
      // window.location.href = profileUrl
    }
  }

  const handleModalOpen = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    signin({ username: email, password })
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
      <DropdownMenuContent align="end" asChild>
        <Card className="p-4" style={{ width: "324px" }}>
          {/* <CardHeader className="mb-3 p-0">
            <CardTitle className="text-xl">Login</CardTitle>
          </CardHeader> */}
          {!walletsRendered && (
            <CardContent className="space-y-3 p-0">
              <p>
                In order to access the marketplace and trade cards please log-in
                with your Cosmik Battle credentials. No account? Download Cosmik
                Battle
              </p>
              <form onSubmit={handleSubmit}>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                {error && <p className="text-red-500">{error.message}</p>}
                <Button
                  className="mt-2"
                  type="submit"
                  isLoading={isPending}
                  disabled={isPending}
                >
                  Connect my account
                </Button>
              </form>
            </CardContent>
          )}
          {walletsRendered && (
            <CardContent className="space-y-3 p-0">
              {wallets.map((wallet) => (
                <AccountWallet
                  key={wallet.name}
                  name={wallet.name}
                  icon={wallet.icon}
                  isComethWallet={wallet.isComethWallet}
                  handleConnect={handleConnect}
                />
              ))}
            </CardContent>
          )}
          {isModalOpen && (
            <AddNewDeviceDialog
              setIsOpen={setIsModalOpen}
              onClose={handleModalOpen}
            ></AddNewDeviceDialog>
          )}
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
