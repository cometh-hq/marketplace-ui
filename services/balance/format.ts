import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"

import globalConfig from "@/config/globalConfig"

export const balanceToBigNumber = (balance?: bigint | null) => {
  if (!balance) return BigNumber.from(0)
  return BigNumber.from(balance)
}

export const balanceToString = (
  balance = balanceToBigNumber(),
  isNativeToken = false
) => {
  if (!balance) return "0"
  return (+formatUnits(
    balance.toString(),
    isNativeToken
      ? globalConfig.decimals.nativeTokenDecimals
      : globalConfig.ordersErc20.decimals
  )).toFixed(2)
}
