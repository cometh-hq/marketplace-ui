"use client"

import { useAvailableAccounts } from "@/lib/web3/auth"
import { ButtonProps } from "@/components/ui/button"

import { CurrentAccountDropdown } from "./current-account-dropdown"

export type AccountDropdownButtonProps = {
  variant?: ButtonProps["variant"]
}

export function AccountDropdownButton({ variant }: AccountDropdownButtonProps) {
  const availableAccounts = useAvailableAccounts()

  return (
    <div className="relative flex gap-3">
      <CurrentAccountDropdown
        buttonVariant={variant}
        isolated={availableAccounts.length === 1}
      />
    </div>
  )
}
