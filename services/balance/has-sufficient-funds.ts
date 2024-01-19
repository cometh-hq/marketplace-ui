import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { getNativeBalance, getOrdersERC20Balance } from "./balanceService"
import { balanceToBigNumber } from "./format"

export type FetchHasSufficientFundsOptions = {
  address: Address
  price?: BigNumber | null
  includeWrappedNative?: boolean
}

export type UseHasSufficientFundsOptions = {
  address?: Address | null
  price?: BigNumber | null
  includeWrappedNative?: boolean
}

export const fetchHasSufficientFunds = async ({
  address,
  price,
  includeWrappedNative = true,
}: FetchHasSufficientFundsOptions) => {
  const [mainBalance, erc20Balance] = await Promise.all([
    getNativeBalance(address),
    getOrdersERC20Balance(address),
  ])

  let availableFunds = BigNumber.from(0)
  if (includeWrappedNative || !globalConfig.useNativeForOrders) {
    availableFunds = availableFunds.add(balanceToBigNumber(erc20Balance))
  }
  if (globalConfig.useNativeForOrders) {
    availableFunds = availableFunds.add(mainBalance)
  }

  const hasSufficientFunds = availableFunds.gte(price ?? 0)

  const missingBalance = hasSufficientFunds
    ? BigNumber.from(0)
    : price?.sub(availableFunds)

  return {
    hasSufficientFunds,
    missingBalance,
  }
}

export const useHasSufficientFunds = ({
  address,
  price,
  includeWrappedNative = true,
}: UseHasSufficientFundsOptions) => {
  return useQuery({
    queryKey: ["hasSufficientFunds", address, price],
    queryFn: async () =>
      fetchHasSufficientFunds({
        address: address!,
        price,
        includeWrappedNative,
      }),

    enabled: !!address && !!price,
  })
}
