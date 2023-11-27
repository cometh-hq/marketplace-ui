"use client"

import Image from "next/image"
import { useCurrentViewerAddress, useIsComethWallet } from "@/lib/web3/auth"
import { User } from "lucide-react"
import { useWindowSize } from "usehooks-ts"
import { Button, ButtonProps } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserLink } from "@/components/ui/user-button"
import { ButtonLoading } from "@/components/button-loading"

import { CopyButton } from "../ui/copy-button"
import { AccountBalance } from "./account-balance"
import { AccountLogAction } from "./log-actions"

export type AccountDropdownProps = {
  buttonVariant?: ButtonProps["variant"]
  isolated?: boolean
}

export function CurrentAccountDropdown({
  buttonVariant,
}: AccountDropdownProps) {
  const isComethWallet = useIsComethWallet()
  const viewerAddress = useCurrentViewerAddress()
  const { width } = useWindowSize()

  const isMobile = width < 640
  const walletIcon = isComethWallet
    ? `/icons/cometh-connect.png`
    : `/icons/metamask.svg`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={isMobile ? "icon" : "default"} variant={buttonVariant}>
          <User size="18" className="md:mr-1" />
          {!isMobile && "Account"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" asChild>
        <Card className="p-4" style={{ width: "324px" }}>
          <CardHeader className="mb-2 space-y-0 p-0">
            <AccountLogAction />
            <div className="flex items-center gap-2">
              <Image src={walletIcon} alt="" width={40} height={40} />
              <Image src={walletIcon} alt="" width={40} height={40} />
              <div>
                <CardTitle className="relative -mb-2 text-sm font-semibold">
                  Account
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
            <AccountBalance />
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
