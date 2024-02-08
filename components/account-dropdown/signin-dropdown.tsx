"use client"

import { useEffect, useState } from "react"
import { useCosmikSignin } from "@/services/cometh-marketplace/cosmik/signin"
import { WalletIcon } from "lucide-react"

import { env } from "@/config/env"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "../ui/input"
import { AddNewDeviceDialog } from "../ui/modal-add-new-device"
import { AccountWallet } from "./account-wallet"
import { cx } from "class-variance-authority"

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

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [walletsRendered, setWalletsRendered] = useState(false)
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
      setCurrentUser(data.user)
      setWalletsRendered(true)
    }
  }, [isSuccess, data])

  useEffect(() => {
    if (error) {
      setIsModalOpen(true)
    }
  }, [error])

  useEffect(() => {
    if (!currentUser) {
      const userString = localStorage.getItem("user")
      if (userString) {
        const user: User = JSON.parse(userString)
        setWalletsRendered(true)
        setCurrentUser(user)
      }
    }
  }, [currentUser])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setCurrentUser(null)
    setWalletsRendered(false)
  }

  const handleModalOpen = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    signin({ username: email, password })

    // try {
    //   const response = await axios.post(
    //     "https://api.develop.cosmikbattle.com/api/login",
    //     {
    //       username: email,
    //       password: password,
    //     },
    //     { withCredentials: true }
    //   )

    //   if (response.data.success) {
    //     const user = response.data.user
    //     if (user.userName) {
    //       setWalletsRendered(true)
    //       localStorage.setItem("user", JSON.stringify(user))
    //     }
    //     try {
    //       // Check if user has already added this device
    //       await retrieveWalletAddressFromSigner(user.address)
    //     } catch (error) {
    //       console.log("Error retrieving wallet address from signer", error)
    //       setIsModalOpen(true)
    //     }
    //   } else {
    //     console.log("Login failed", response.data.errorKey)
    //   }
    // } catch (error) {
    //   console.error("Error adding new device", error)
    // }
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
        <Card className="mt-1 p-4" style={{ width: "324px" }}>
          {!walletsRendered && (
            <CardContent className="space-y-3 p-0">
              <p>
                In order to access the marketplace and trade cards please log-in
                with your Cosmik Battle credentials. No account? Download Cosmik
                Battle
              </p>
              <form onSubmit={handleSubmit} className="space-y-2">
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
                  size="lg"
                  className="w-full"
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
            <>
              <Button onClick={handleLogout}>Logout</Button>
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
            </>
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
