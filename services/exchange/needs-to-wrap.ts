import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { fetchHasSufficientFunds } from "../balance/has-sufficient-funds"
import { getOrdersERC20Balance } from "../balance/balanceService"
import { balanceToBigNumber } from "../balance/format"

export type FetchNeedsToWrapOptions = {
  price: BigNumber
  address: Address
  wrappedContractAddress: Address
}

/**
 * Returns the amount that needs to be wrapped to cover the price.
 * otherwise returns false because the user has sufficient funds wrapped
 * to cover the price
 */
export const fetchNeedsToWrap = async ({
  price,
  address,
  wrappedContractAddress,
}: FetchNeedsToWrapOptions): Promise<boolean> => {
  const hasSufficientFunds = await fetchHasSufficientFunds({
    address,
    price
  })
  if (!hasSufficientFunds) return false

  const wrappedBalance = await getOrdersERC20Balance(
    address
  )
  return !balanceToBigNumber(wrappedBalance).gte(price)
}

export type UseNeedsToWrapOptions = {
  price?: BigNumber | null
  address?: Address | null
}

export const useNeedsToWrap = ({ price, address }: UseNeedsToWrapOptions) => {
  return useQuery({
    queryKey: ["needsToWrap", price, address],
    queryFn: async () =>
      fetchNeedsToWrap({
        price: price!,
        address: address!,
        wrappedContractAddress: globalConfig.network.wrappedNativeToken.address,
      }),
    enabled: !!address && !!price,
  })
}
