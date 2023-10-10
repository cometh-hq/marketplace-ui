"use client"

import Image from "next/image"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { Button, ButtonProps } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserLink } from "@/components/ui/user-button"
import { ButtonLoading } from "@/components/button-loading"

import { AccountLogAction } from "./log-actions"

import { User } from "lucide-react"
import { AccountWallet } from "./account-wallet"
import { CopyButton } from "../ui/copy-button"
import { useWindowSize } from 'usehooks-ts'

export type AccountDropdownProps = {
  buttonVariant?: ButtonProps["variant"]
  isolated?: boolean
}

export function CurrentAccountDropdown({
  buttonVariant,
}: AccountDropdownProps) {
  const viewerAddress = useCurrentViewerAddress()
  const { width, height } = useWindowSize()

  const isMobile = width < 640

  if (!viewerAddress?.length) return <ButtonLoading />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={isMobile ? "icon" : "default"}
          variant={buttonVariant}
        >
          <User size="18" className="md:mr-1" />
          {!isMobile && "Account"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" asChild>
        <Card className="p-4" style={{ width: "324px" }}>
          <CardHeader className="space-y-0 p-0 mb-2">
            <AccountLogAction />
            <div className="flex items-center gap-2">
              <Image
                src="/icons/metamask.svg"
                alt=""
                width={40}
                height={40}
              />
              <div>
                <CardTitle className="relative text-sm font-semibold -mb-2">Account</CardTitle>
                <CardDescription>
                  <span className="flex items-center">
                    <UserLink
                      user={{ address: viewerAddress }}
                      className="mr-2 text-sm"
                      hideIcon
                      forceDisplayAddress
                    />
                    <CopyButton textToCopy={viewerAddress} />
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <AccountWallet />
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
