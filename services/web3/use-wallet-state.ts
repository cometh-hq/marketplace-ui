"use client"

import { useWeb3OnboardContext } from "@/providers/web3-onboard"

export function useGetWalletState() {
  const { onboard } = useWeb3OnboardContext()

  function getWalletState() {
    if (onboard) {
      return onboard.state.get().wallets?.[0]
    }

    return null
  }

  return getWalletState
}
