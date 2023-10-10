import { manifest } from "@/manifests"
import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"

import { fetchHasSufficientFunds } from "../balance/has-sufficient-funds"
import { fetchWrappedBalance } from "../balance/wrapped"

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
    price,
    wrappedContractAddress,
  })
  if (!hasSufficientFunds) return false

  const wrappedBalance = await fetchWrappedBalance(
    address,
    wrappedContractAddress
  )
  return !wrappedBalance.gte(price)
}

export type UseNeedsToWrapOptions = {
  price?: BigNumber | null
  address?: Address | null
}

export const useNeedsToWrap = ({ price, address }: UseNeedsToWrapOptions) => {
  return useQuery(
    ["needsToWrap", price, address],
    async () =>
      fetchNeedsToWrap({
        price: price!,
        address: address!,
        wrappedContractAddress: manifest.currency.wrapped.address,
      }),
    { enabled: !!address && !!price }
  )
}
