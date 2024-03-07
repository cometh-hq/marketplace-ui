import { useMemo } from "react"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useGetCollection } from "@/services/cometh-marketplace/collection"
import { parseUnits } from "viem"

import globalConfig from "@/config/globalConfig"
import {
  calculateAmountWithoutFees,
  calculateFeesAmount,
} from "@/lib/utils/fees"

import { Price } from "./price"

type PriceDetailsProps = {
  fullPrice: string
  isEthersFormat?: boolean
}

export function PriceDetails({
  fullPrice,
  isEthersFormat = true,
}: PriceDetailsProps) {
  const { currentCollectionAddress } = useCurrentCollectionContext()
  const { data: collection } = useGetCollection(currentCollectionAddress)
  const sumOfFeesPercentages = collection
    ? collection.collectionFees.reduce((sum, fee) => sum + fee.feePercentage, 0)
    : 0
  let price = fullPrice ? fullPrice : "0"
  if (isEthersFormat) {
    price = parseUnits(price, globalConfig.ordersErc20.decimals).toString()
  }

  const { amountWithoutFees, feesAmount } = useMemo(() => {
    let amountWithoutFees = BigInt(0)
    let feesAmount = BigInt(0)
    if (price !== "0") {
      amountWithoutFees = calculateAmountWithoutFees(
        price,
        sumOfFeesPercentages
      ).toBigInt()
      feesAmount = BigInt(
        calculateFeesAmount(amountWithoutFees, sumOfFeesPercentages)
      )
    }
    return {
      amountWithoutFees,
      feesAmount,
    }
  }, [price, sumOfFeesPercentages])

  return (
    <div className="flex flex-col gap-2 rounded border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span>You will receive:</span>
        <Price amount={amountWithoutFees} className="font-normal" />
      </div>
      <div className="flex items-center justify-between">
        <span>Fees ({sumOfFeesPercentages}%):</span>
        <Price amount={feesAmount} className="font-normal" />
      </div>
      <hr className="my-0.5" />
      <div className="flex items-center justify-between">
        <span className="font-medium">Total price:</span>
        <Price amount={price || 0} className="font-semibold" />
      </div>
    </div>
  )
}
