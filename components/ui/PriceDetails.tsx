import { useMemo } from "react"
import { manifest } from "@/manifests/manifests"
import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import { parseUnits } from "viem"

import globalConfig from "@/config/globalConfig"
import {
  calculateAmountWithoutFees,
  calculateFeesAmount,
} from "@/lib/utils/fees"

import { Price } from "./Price"

type PriceDetailsProps = {
  fullPrice: string
  isEthersFormat?: boolean
}

export function PriceDetails({
  fullPrice,
  isEthersFormat = true,
}: PriceDetailsProps) {
  const isComethWallet = useIsComethConnectWallet()
  const { currentCollectionAddress } = useCurrentCollectionContext()
  const { data: collection } = useGetCollection(currentCollectionAddress)
  const sumOfFeesPercentages = collection
    ? collection.collectionFees.reduce((sum, fee) => sum + fee.feePercentage, 0)
    : 0
  let price = fullPrice ? fullPrice : "0"
  if (isEthersFormat) {
    price = parseUnits(price, globalConfig.ordersErc20.decimals).toString()
  }
  const contractIsSponsored = manifest.areContractsSponsored && isComethWallet

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
    <div className="rounded border p-4 shadow">
      <div className="flex  flex-col justify-between sm:flex-row">
        <span>You will receive:</span>
        <span>
          <Price
            fontWeight="normal"
            amount={amountWithoutFees}
            shouldDisplayFiatPrice={true}
          />
        </span>
      </div>
      <div className="flex flex-col justify-between sm:flex-row">
        <span>Fees ({sumOfFeesPercentages}%):</span>
        <span>
          <Price
            fontWeight="normal"
            amount={feesAmount}
            shouldDisplayFiatPrice={true}
          />
        </span>
      </div>
      {contractIsSponsored && (
        <div className="flex flex-col justify-between sm:flex-row">
          <span>Gas transaction:</span>
          <span className="font-medium">Sponsored</span>
        </div>
      )}
      <hr className="my-2" />
      <div className="flex flex-col justify-between sm:flex-row">
        <span>Total price:</span>
        <span>
          <Price
            fontWeight="normal"
            amount={price || 0}
            shouldDisplayFiatPrice={true}
          />
        </span>
      </div>
    </div>
  )
}
