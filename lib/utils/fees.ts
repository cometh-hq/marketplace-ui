import { UserFacingFeeStruct } from "@traderxyz/nft-swap-sdk"
import { BigNumber, BigNumberish } from "ethers"

const FEE_PERCENTAGE_PRECISION = 6

const _scalePrecision = (value: BigNumberish): BigNumber => {
  if (typeof value === "number") {
    return BigNumber.from(value * 10 ** FEE_PERCENTAGE_PRECISION)
  } else {
    return BigNumber.from(value).mul(10 ** FEE_PERCENTAGE_PRECISION)
  }
}

export const calculateAmountWithoutFees = (
  priceWithFees: BigNumberish,
  feePercentage: BigNumberish
): BigNumber => {

  const scaledPercentage = _scalePrecision(feePercentage).div(100)

  return _scalePrecision(priceWithFees).div(
    _scalePrecision(1).add(scaledPercentage)
  )
}

export const calculateFeesAmount = (
  price: BigNumberish,
  percentage: number
): string => {
  const intFeePercentage = percentage * 10 ** FEE_PERCENTAGE_PRECISION
  

  const feeAmount = BigNumber.from(intFeePercentage)
    .mul(price)
    .div(100)
    .div(10 ** FEE_PERCENTAGE_PRECISION)
    .toString()

  return feeAmount.toString()
}

export const totalFeesFromCollection = (fees: UserFacingFeeStruct[]) => {
  return fees.reduce((total, fee) => total.add(fee.amount), BigNumber.from(0))
}
