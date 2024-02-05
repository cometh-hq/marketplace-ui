"use client"

import { useCallback } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { DisconnectOptions } from "@web3-onboard/core"

export type LogoutStatus = "idle" | "isLoggingOut" | "isLoggedOut"

export function useWalletDisconnect() {
  const { onboard, setIsconnected } = useWeb3OnboardContext()

  const disconnectFunction = useCallback(
    async (wallet: DisconnectOptions) => {
      localStorage.removeItem("selectedWallet")
      setIsconnected(false)
      return await onboard?.disconnectWallet(wallet)
    },
    [onboard, setIsconnected]
  )

  return { disconnect: disconnectFunction }
}
