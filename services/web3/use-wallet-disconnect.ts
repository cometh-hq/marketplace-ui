"use client"

import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { DisconnectOptions } from "@web3-onboard/core"

export type LogoutStatus = "idle" | "isLoggingOut" | "isLoggedOut"

export function useWalletDisconnect() {
  const { onboard, setIsconnected } = useWeb3OnboardContext()

  async function disconnect(wallet: DisconnectOptions) {
    localStorage.removeItem("selectedWallet")
    setIsconnected(false)
    return await onboard?.disconnectWallet(wallet)
  }

  return { disconnect }
}
