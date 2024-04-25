"use client"

import Image from "next/image"
import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { useAllBalances } from "@/services/balance/balanceService"
import { WalletIcon } from "lucide-react"
import { useWindowSize } from "usehooks-ts"
import { useAccount } from "wagmi"

import { env } from "@/config/env"
import globalConfig from "@/config/globalConfig"
import { Button, ButtonProps } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { UserLink } from "@/components/ui/user/UserLink"

import { CopyButton } from "../ui/CopyButton"
import { AccountBalance, AccountBalanceLine } from "./AccountBalance"
import { AccountLogoutAction } from "./AccountLogoutAction"

export type AccountDropdownProps = {
  buttonVariant?: ButtonProps["variant"]
  isolated?: boolean
}

export function CurrentAccountDropdown({
  buttonVariant,
}: AccountDropdownProps) {
  const isComethWallet = useIsComethConnectWallet()
  const account = useAccount()
  const viewerAddress = account.address
  const { width } = useWindowSize()
  const balances = useAllBalances()

  const isMobile = width < 640

  const walletIcon = isComethWallet
    ? `${env.NEXT_PUBLIC_BASE_PATH}/cometh-connect.png`
    : `${env.NEXT_PUBLIC_BASE_PATH}/metamask.svg`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size={isMobile ? "icon" : "default"}>
          <WalletIcon size="18" className="md:mr-2" />
          {!isMobile && balances && (
            <AccountBalanceLine
              balance={
                globalConfig.useNativeForOrders
                  ? balances.native
                  : balances.ERC20
              }
              currency={globalConfig.ordersErc20.symbol}
              logo={globalConfig.ordersErc20.thumb}
              hideFiatPrice
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" asChild>
        <Card className="p-4" style={{ width: "324px" }}>
          <CardHeader className="mb-2 space-y-0 p-0">
            <AccountLogoutAction />
            <div className="flex items-center gap-2">
              <Image src={walletIcon} alt="" width={40} height={40} />
              <div>
                <CardTitle className="relative -mb-2 text-sm font-semibold">
                  Wallet
                </CardTitle>
                <div className="flex items-center">
                  {viewerAddress && (
                    <>
                      <UserLink
                        user={{ address: viewerAddress }}
                        className="mr-2 text-sm"
                        hideIcon
                        forceDisplayAddress
                      />
                      <CopyButton textToCopy={viewerAddress} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <AccountBalance />
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
