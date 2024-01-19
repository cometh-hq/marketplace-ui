import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"

export const balanceToBigNumber = (
  balance?: bigint | null
) => {
  if (!balance) return BigNumber.from(0)
  return BigNumber.from(balance)
}

export const balanceToString = (
  balance = balanceToBigNumber()
) => {
  if (!balance) return "0"
  return (+formatUnits(balance.toString(), 18)).toFixed(2)
}