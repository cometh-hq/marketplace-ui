import { useMemo } from "react"
import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { useNativeBalance } from "./balanceService"

export const computeHasEnoughGas = (
  walletAddress: Address | undefined,
  isComethWallet: boolean,
  nativeBalance?: bigint
): { hasEnoughGas: boolean } => {
  if (isComethWallet && globalConfig.areContractsSponsored)
    return { hasEnoughGas: true }
  if (!walletAddress || nativeBalance === undefined)
    return { hasEnoughGas: false }

  return {
    hasEnoughGas: nativeBalance > globalConfig.minimumBalanceForGas,
  }
}

export const useHasEnoughGas = (walletAddress: Address | undefined) => {
  const isComethWallet = useIsComethConnectWallet()
  const { balance: nativeBalance } = useNativeBalance(walletAddress)
  return useMemo(() => {
    return computeHasEnoughGas(walletAddress, isComethWallet, nativeBalance)
  }, [walletAddress, isComethWallet, nativeBalance])
}
