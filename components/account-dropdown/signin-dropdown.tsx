"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { AccountWallet } from "./account-wallet"

import { env } from "@/config/env"

export type SigninDropdownProps = {
  disabled: boolean
  handleConnect?: (isComethWallet: boolean) => Promise<void>
}

export function SigninDropdown({
  disabled,
  handleConnect,
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
        <Button variant="default" disabled={disabled} isLoading={disabled}>
          Signin
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" asChild>
        <Card className="p-4" style={{ width: "324px" }}>
          <CardHeader className="mb-3 p-0">
            <CardTitle className="text-xl">Signin</CardTitle>
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
