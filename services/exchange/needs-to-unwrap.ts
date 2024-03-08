import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Binary } from "lucide-react"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { getOrdersERC20Balance } from "../balance/balanceService"
import { balanceToBigNumber } from "../balance/format"
import { fetchHasSufficientFunds } from "../balance/has-sufficient-funds"

export type FetchNeedsToUnwrapOptions = {
  price: BigNumber
  address: Address
  isComethWallet?: boolean
}

export type NeedsToUnwrapData = {
  needsToUnwrap: boolean
  balanceToUnwrap: BigNumber
}

/**
 * Returns the amount that needs to be wrapped to cover the price.
 * otherwise returns false because the user has sufficient funds wrapped
 * to cover the price
 */
export const fetchNeedsToUnwrap = async ({
  price,
  address,
  isComethWallet,
}: FetchNeedsToUnwrapOptions): Promise<NeedsToUnwrapData> => {
  if (!globalConfig.useNativeForOrders) {
    return {
      needsToUnwrap: false,
      balanceToUnwrap: BigNumber.from(0),
    }
  }

  const targetedNativeBalance =
    !globalConfig.areContractsSponsored && !isComethWallet
      ? price.add(BigNumber.from(globalConfig.minimumBalanceForGas))
      : price

  const missingNativeTokenData = await fetchHasSufficientFunds({
    address,
    price: targetedNativeBalance,
    includeWrappedNative: false,
  })

  if (
    missingNativeTokenData.hasSufficientFunds ||
    !missingNativeTokenData.missingBalance
  ) {
    return {
      needsToUnwrap: false,
      balanceToUnwrap: BigNumber.from(0),
    }
  }

  return {
    needsToUnwrap: true,
    balanceToUnwrap: missingNativeTokenData.missingBalance,
  }
}

export type UseNeedsToUnwrapOptions = {
  price?: BigNumber | null
  address?: Address | null
}

export const useNeedsToUnwrap = ({
  price,
  address,
}: UseNeedsToUnwrapOptions) => {
  return useQuery({
    queryKey: ["needsToUnwrap", price, address],
    queryFn: async () =>
      fetchNeedsToUnwrap({
        price: price!,
        address: address!,
      }),
    enabled: !!address && !!price,
  })
}
