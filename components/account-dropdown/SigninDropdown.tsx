"use client"

import { useCallback } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { cx } from "class-variance-authority"
import { WalletIcon } from "lucide-react"
import { useConnect } from "wagmi"


import { env } from "@/config/env"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

import { AccountWallet } from "./AccountWallet"

export type SigninDropdownProps = {
  disabled: boolean
  fullVariant?: boolean
  customText?: string
}

export function SigninDropdown({
  disabled,
  fullVariant,
  customText,
}: SigninDropdownProps) {
  const { open, close } = useWeb3Modal()

  const { connect } = useConnect()

  const handleComethConnectLogin = useCallback(async () => {
    // const connector = new ComethConnectConnector({
    //   chains: [marketplaceChain],
    //   options: { apiKey: manifest.walletConnectProjectId },
    // })
    // await connect({ connector })
  }, [connect])

  const wallets = [
    ...(env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY
      ? [
          {
            name: "Cometh Connect",
            icon: `${env.NEXT_PUBLIC_BASE_PATH}/cometh-connect.png`,
            isComethWallet: true,
            handleConnect: handleComethConnectLogin,
          },
        ]
      : []),
    {
      name: "External wallets",
      icon: `${env.NEXT_PUBLIC_BASE_PATH}/metamask.svg`,
      isComethWallet: false,
      handleConnect: () => {
        open && open()
      },
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cx({
            "h-12 w-full": fullVariant,
          })}
          disabled={disabled}
          isLoading={disabled}
        >
          {<WalletIcon size="16" className="mr-2" />}
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
                handleConnect={wallet.handleConnect}
              />
            ))}
          </CardContent>
          {/* ConnectButton MUST BE included in the DOM for the modal to appear, but can be hidden.*/}
          <div className="hidden">
            <w3m-button />
            <ConnectButton />
          </div>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
