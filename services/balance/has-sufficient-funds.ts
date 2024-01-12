import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { getNativeBalance, getOrdersERC20Balance } from "./balanceService"
import { balanceToBigNumber } from "./format"

export type FetchHasSufficientFundsOptions = {
  address: Address
  price?: BigNumber | null
}

export type UseHasSufficientFundsOptions = {
  address?: Address | null
  price?: BigNumber | null
}

export const fetchHasSufficientFunds = async ({
  address,
  price,
}: FetchHasSufficientFundsOptions) => {
  const [mainBalance, erc20Balance] = await Promise.all([
    getNativeBalance(address),
    getOrdersERC20Balance(address),
  ])

  let availableFunds = balanceToBigNumber(erc20Balance)
  if (globalConfig.useNativeForOrders) {
    availableFunds = availableFunds.add(mainBalance)
  }

  const hasSufficientFunds = availableFunds.gte(price ?? 0)

  const missingBalance = hasSufficientFunds
    ? BigNumber.from(0)
    : price?.sub(availableFunds)

  console.warn("fetchHasSufficientFunds", {
    availableFunds: availableFunds.toString(),
    erc20Balance: erc20Balance.toString(),
    mainBalance: mainBalance.toString(),
    hasSufficientFunds: hasSufficientFunds.toString(),
    missingBalance: missingBalance?.toString(),
  })

  return {
    hasSufficientFunds,
    missingBalance,
  }
}

export const useHasSufficientFunds = ({
  address,
  price,
}: UseHasSufficientFundsOptions) => {
  return useQuery({
    queryKey: ["hasSufficientFunds", address, price],
    queryFn: async () =>
      fetchHasSufficientFunds({
        address: address!,
        price,
      }),

    enabled: !!address && !!price,
  })
}
