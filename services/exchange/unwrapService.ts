import { useMemo } from "react"
import { BigNumber } from "ethers"

import globalConfig from "@/config/globalConfig"

import { useERC20Balance, useNativeBalance } from "../balance/balanceService"
import { computeHasSufficientFunds } from "../balance/fundsService"

export type ComputeNeedsToUnwrapOptions = {
  price: BigNumber
  isComethWallet?: boolean
  nativeBalance?: bigint
  wrappedBalance?: bigint
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
export const computeNeedToUnwrap = ({
  price,
  isComethWallet,
  nativeBalance,
  wrappedBalance,
}: ComputeNeedsToUnwrapOptions): NeedsToUnwrapData => {
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

  const missingNativeTokenData = computeHasSufficientFunds({
    price: targetedNativeBalance,
    includeWrappedNative: false,
    nativeBalance,
    erc20Balance: wrappedBalance,
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
}

export const useNeedsToUnwrap = ({ price }: UseNeedsToUnwrapOptions) => {
  const { balance: nativeBalance } = useNativeBalance()
  const { balance: erc20Balance } = useERC20Balance(
    globalConfig.ordersErc20.address
  )
  return useMemo(() => {
    return computeNeedToUnwrap({
      price: price!,
      nativeBalance,
      wrappedBalance: erc20Balance,
    })
  }, [price, nativeBalance, erc20Balance])
}
