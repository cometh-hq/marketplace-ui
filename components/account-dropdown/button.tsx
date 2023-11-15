"use client"

import { ButtonProps } from "@/components/ui/button"

import { CurrentAccountDropdown } from "./current-account-dropdown"
import { SigninDropdown } from "./signin-dropdown"

export type AccountDropdownButtonProps = {
  variant?: ButtonProps["variant"]
  isLogged?: boolean
  handleConnect?: (isComethWallet: boolean) => Promise<void>
}

export function AccountDropdownButton({
  variant,
  isLogged,
  handleConnect,
}: AccountDropdownButtonProps) {
  return (
    <div className="relative flex gap-3">
      {isLogged ? (
        <CurrentAccountDropdown buttonVariant={variant} />
      ) : (
        <SigninDropdown buttonVariant={variant} handleConnect={handleConnect} />
      )}
    </div>
  )
}
