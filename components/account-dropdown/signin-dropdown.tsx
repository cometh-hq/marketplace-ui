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
  customText?: string
  isLinkVariant?: boolean
}

export function SigninDropdown({
  disabled,
  handleConnect,
  fullVariant,
  customText,
  isLinkVariant
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
    {
      name: "External wallets",
      icon: `${env.NEXT_PUBLIC_BASE_PATH}/metamask.svg`,
      isComethWallet: false,
    },
  ]

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
