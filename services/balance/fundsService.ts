import { useMemo } from "react"
import { BigNumber } from "ethers"

import globalConfig from "@/config/globalConfig"
import { balanceToBigNumber } from "@/lib/utils/formatBalance"
import { useERC20Balance, useNativeBalance } from "./balanceService"

export type FetchHasSufficientFundsOptions = {
  price?: BigNumber | null
  includeWrappedNative?: boolean
  nativeBalance?: bigint
  erc20Balance?: bigint
}

export type UseHasSufficientFundsOptions = {
  price?: BigNumber | null
  nativeBalance?: bigint
  erc20Balance?: bigint
  includeWrappedNative?: boolean
}

export const computeHasSufficientFunds = ({
  price,
  nativeBalance,
  erc20Balance,
  includeWrappedNative = true,
}: FetchHasSufficientFundsOptions) => {
  let availableFunds = BigNumber.from(0)
  if (!nativeBalance || !erc20Balance) {
    return {
      hasSufficientFunds: false,
      missingBalance: BigNumber.from(0),
    }
  }

  if (includeWrappedNative || !globalConfig.useNativeForOrders) {
    availableFunds = availableFunds.add(balanceToBigNumber(erc20Balance))
  }
  if (globalConfig.useNativeForOrders) {
    availableFunds = availableFunds.add(nativeBalance)
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
  price,
  includeWrappedNative = true,
}: UseHasSufficientFundsOptions) => {
  const { balance: nativeBalance } = useNativeBalance()
  const { balance: erc20Balance } = useERC20Balance(globalConfig.ordersErc20.address)
  return useMemo(() => {
    return computeHasSufficientFunds({
      price,
      nativeBalance,
      erc20Balance,
      includeWrappedNative,
    })
  }, [price, nativeBalance, erc20Balance, includeWrappedNative])
}
