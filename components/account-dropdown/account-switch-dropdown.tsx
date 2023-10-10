"use client"

import React from "react"
import { ChevronDown } from "lucide-react"
import { Address } from "viem"

import { shortenAddress } from "@/lib/utils/addresses"
import { useAvailableAccounts, useCurrentAccountIndex } from "@/lib/web3/auth"
import { Button, ButtonProps } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type AccountSwitchDropdownProps = {
  buttonVariant?: ButtonProps["variant"]
}

export function AccountSwitchDropdown({
  buttonVariant,
}: AccountSwitchDropdownProps) {
  const [currentAccountIndex, setCurrentAccountIndex] = useCurrentAccountIndex()
  const availableAccounts = useAvailableAccounts()
  const updateCurrentAccount = React.useCallback(
    (index: string) => {
      setCurrentAccountIndex(+index)
    },
    [setCurrentAccountIndex]
  )
  if (typeof currentAccountIndex !== "number") return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={buttonVariant}
          groupPosition="last"
          className="rounded-l-none"
        >
          <ChevronDown size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent asChild>
        <div className="w-[200px]">
          <DropdownMenuRadioGroup
            value={`${currentAccountIndex}`}
            onValueChange={updateCurrentAccount}
          >
            {availableAccounts.map((account, index) => (
              <DropdownMenuRadioItem
                value={`${index}`}
                key={index}
                className="py-2"
              >
                {shortenAddress(account.address as Address)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
