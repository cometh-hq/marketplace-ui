import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { getNativeBalance } from "./balanceService"

export const fetchHasEnoughGas = async (
  walletAddress: Address | undefined,
  isComethWallet: boolean
): Promise<{ hasEnoughGas: boolean }> => {
  if (!walletAddress) return { hasEnoughGas: false }
  if (isComethWallet && globalConfig.areContractsSponsored)
    return { hasEnoughGas: true }
  const nativeTokenBalance = await getNativeBalance(walletAddress)

  return {
    hasEnoughGas: nativeTokenBalance > globalConfig.minimumBalanceForGas,
  }
}

export const useHasEnoughGas = (walletAddress: Address | undefined) => {
  const isComethWallet = useIsComethConnectWallet()
  return useQuery({
    queryKey: ["useHasEnoughGas", walletAddress],
    queryFn: async () => fetchHasEnoughGas(walletAddress, isComethWallet),

    enabled: !!walletAddress,
  })
}
