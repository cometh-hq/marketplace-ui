"use client"

import { useCallback } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"

export function useGetWalletState() {
  const { onboard } = useWeb3OnboardContext()

  return useCallback(
     () => {
      if (onboard) {
        return onboard.state.get().wallets?.[0]
      }

      return null
    },
    [onboard]
  )
}
