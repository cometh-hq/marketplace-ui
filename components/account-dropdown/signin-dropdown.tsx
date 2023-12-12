"use client"

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

import { AccountWallet } from "./account-wallet"

export type SigninDropdownProps = {
  disabled: boolean
  handleConnect?: (isComethWallet: boolean) => Promise<void>
  fullVariant?: boolean
}

export function SigninDropdown({
  disabled,
  handleConnect,
  fullVariant
}: SigninDropdownProps) {
  const wallets = [
    ...(env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY
      ? [
          {
            name: "Cometh",
            icon: `${process.env.NEXT_PUBLIC_BASE_PATH}/icons/cometh-connect.png`,
            isComethWallet: true,
          },
        ]
      : []),
    {
      name: "Metamask",
      icon: `${process.env.NEXT_PUBLIC_BASE_PATH}/icons/metamask.svg`,
      isComethWallet: false,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cx({
            "w-full h-12": fullVariant,
          })}
          variant="default"
          disabled={disabled}
          isLoading={disabled}
        >
          <WalletIcon size="16" className="mr-2" />
          Login
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" asChild>
        <Card className="p-4" style={{ width: "324px" }}>
          <CardHeader className="mb-3 p-0">
            <CardTitle className="text-xl">Login</CardTitle>
          </CardHeader>
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
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
