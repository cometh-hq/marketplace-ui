import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

import { getNativeBalance } from "./balanceService"

export const fetchHasEnoughGas = async (
  walletAddress: Address | undefined
): Promise<{ hasEnoughGas: boolean }> => {
  if (!walletAddress) return { hasEnoughGas: false }
  const nativeTokenBalance = await getNativeBalance(walletAddress)

  return { hasEnoughGas: nativeTokenBalance > 0 }
}

export const useHasEnoughGas = (walletAddress: Address | undefined) => {
  return useQuery({
    queryKey: ["useHasEnoughGas", walletAddress],
    queryFn: async () => fetchHasEnoughGas(walletAddress),

    enabled: !!walletAddress,
  })
}
