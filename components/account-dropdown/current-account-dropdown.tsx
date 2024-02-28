"use client"

import Image from "next/image"
import Link from "next/link"
import { useUsername } from "@/services/user/use-username"
import { User } from "lucide-react"
import { useWindowSize } from "usehooks-ts"

import { env } from "@/config/env"
import { shortenAddress } from "@/lib/utils/addresses"
import { useCurrentViewerAddress, useIsComethWallet } from "@/lib/web3/auth"
import { Button, ButtonProps } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const { username, isFetchingUsername } = useUsername(viewerAddress as string)
  const { width } = useWindowSize()

  const isMobile = width < 640

  const walletIcon = isComethWallet
    ? `${env.NEXT_PUBLIC_BASE_PATH}/cometh-connect.png`
    : `${env.NEXT_PUBLIC_BASE_PATH}/metamask.svg`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={isMobile ? "icon" : "default"} variant={buttonVariant}>
          <User size="18" className="md:mr-1" />
          {!isMobile && "Account"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent variant="dialog" align="end" asChild>
        <Card className="p-4" style={{ width: "324px" }}>
          <CardHeader className="mb-2 space-y-0 p-0">
            <AccountLogAction />
            <div className="flex items-center gap-2">
              <Image src={walletIcon} alt="" width={40} height={40} />
              <Link href={`/profile/${viewerAddress}`} className="group">
                <div className="relative -mb-0.5 text-base font-bold uppercase">
                  {isFetchingUsername ? (
                    <span>...</span>
                  ) : (
                    <span>@{username}</span>
                  )}
                </div>
                {viewerAddress && (
                  <div className="mr-2 text-sm font-medium text-accent transition-colors group-hover:text-white">
                    {shortenAddress(viewerAddress, 4)}
                  </div>
                )}
              </Link>
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
