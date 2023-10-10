"use client"

import { useConnect, useIsConnected } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"

import { AccountDropdownButton } from "./account-dropdown/button"

export function ConnectButton() {
  const isConnected = useIsConnected()
  const connect = useConnect()
  if (isConnected) return <AccountDropdownButton variant="default" />
  return <Button onClick={() => connect()}>Connect&nbsp;<span className="max-md:hidden">wallet</span></Button>
}
