import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import { useBalance } from "wagmi"

export const balanceToBigNumber = (
  balance?: ReturnType<typeof useBalance>["data"] | null
) => {
  if (!balance) return BigNumber.from(0)
  return BigNumber.from(balance.value)
}

export const balanceToString = (
  balance = balanceToBigNumber()
) => {
  if (!balance) return "0"
  return (+formatUnits(balance.toString(), 18)).toFixed(2)
}