import { useMemo } from "react"
import { BigNumber } from "ethers"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { balanceToBigNumber } from "@/lib/utils/formatBalance"

import { useERC20Balance, useNativeBalance } from "../balance/balanceService"
import { computeHasSufficientFunds } from "../balance/fundsService"

export type FetchNeedsToWrapOptions = {
  price: BigNumber
  nativeBalance?: bigint
  erc20Balance?: bigint
}

/**
 * Returns the amount that needs to be wrapped to cover the price.
 * otherwise returns false because the user has sufficient funds wrapped
 * to cover the price
 */
export const computeNeedsToWrap = ({
  price,
  nativeBalance,
  erc20Balance,
}: FetchNeedsToWrapOptions): boolean => {
  const { hasSufficientFunds } = computeHasSufficientFunds({
    price,
    nativeBalance,
    erc20Balance,
  })
  if (!hasSufficientFunds) return false

  return balanceToBigNumber(erc20Balance).lt(price)
}

export type UseNeedsToWrapOptions = {
  price?: BigNumber | null
  address?: Address | null
}

export const useNeedsToWrap = ({ price, address }: UseNeedsToWrapOptions) => {
  const { balance: nativeBalance } = useNativeBalance()
  const { balance: erc20Balance } = useERC20Balance(
    globalConfig.ordersErc20.address
  )
  return useMemo(() => {
    if (!price || !address) return false
    return computeNeedsToWrap({ price, nativeBalance, erc20Balance })
  }, [price, address, nativeBalance, erc20Balance])
}
