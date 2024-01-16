import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { useIsComethWallet } from "@/lib/web3/auth"

import { getNativeBalance } from "./balanceService"

export const fetchHasEnoughGas = async (
  walletAddress: Address | undefined,
  isComethWallet: boolean
): Promise<{ hasEnoughGas: boolean }> => {
  if (!walletAddress) return { hasEnoughGas: false }
  if (isComethWallet && globalConfig.areContractsSponsored)
    return { hasEnoughGas: true }
  const nativeTokenBalance = await getNativeBalance(walletAddress)

  return { hasEnoughGas: nativeTokenBalance > 0 }
}

export const useHasEnoughGas = (walletAddress: Address | undefined) => {
  const isComethWallet = useIsComethWallet()
  return useQuery({
    queryKey: ["useHasEnoughGas", walletAddress],
    queryFn: async () => fetchHasEnoughGas(walletAddress, isComethWallet),

    enabled: !!walletAddress,
  })
}
