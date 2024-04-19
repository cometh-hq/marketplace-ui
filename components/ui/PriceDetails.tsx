import { useMemo } from "react"
import { manifest } from "@/manifests/manifests"
import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"

import {
  calculateAmountWithoutFees,
  calculateFeesAmount,
} from "@/lib/utils/fees"

import TokenQuantity from "../erc1155/TokenQuantity"
import { Price } from "./Price"

type PriceDetailsProps = {
  unitPrice: bigint
  isErc1155?: boolean
  quantity?: bigint
  isReceiving?: boolean
  isEthersFormat?: boolean
}

export function PriceDetails({
  quantity = BigInt(1),
  unitPrice = BigInt(0),
  isErc1155= false,
  isReceiving = true,
}: PriceDetailsProps) {
  const isComethWallet = useIsComethConnectWallet()
  const { currentCollectionAddress } = useCurrentCollectionContext()
  const { data: collection } = useGetCollection(currentCollectionAddress)
  const sumOfFeesPercentages = collection
    ? collection.collectionFees.reduce((sum, fee) => sum + fee.feePercentage, 0)
    : 0

  const contractIsSponsored = manifest.areContractsSponsored && isComethWallet

  const { priceWithoutFees, feesAmount, transactionPrice } = useMemo(() => {
    let priceWithoutFees = BigInt(0)
    let feesAmount = BigInt(0)
    const transactionPrice = unitPrice * quantity
    if (transactionPrice !== BigInt(0)) {
      priceWithoutFees = calculateAmountWithoutFees(
        transactionPrice,
        sumOfFeesPercentages
      ).toBigInt()
      feesAmount = BigInt(
        calculateFeesAmount(priceWithoutFees, sumOfFeesPercentages)
      )
    }

    return {
      priceWithoutFees,
      feesAmount,

      transactionPrice,
    }
  }, [sumOfFeesPercentages, unitPrice, quantity])

  return (
    <div className="w-full rounded border p-4 shadow">
      {isErc1155 && (
        <>
          <div className="flex  flex-col justify-between sm:flex-row">
            <span>Unit price:</span>
            <span>
              <Price
                fontWeight="normal"
                amount={unitPrice}
                shouldDisplayFiatPrice={true}
              />
            </span>
          </div>
          <div className="flex  flex-col justify-between sm:flex-row">
            <span>Quantity:</span>
            <span>
              <TokenQuantity value={quantity} />
            </span>
          </div>

          <hr className="my-2" />
        </>
      )}
      <div className="flex  flex-col justify-between sm:flex-row">
        <span>{isReceiving ? "You will receive:" : "Total without fees"}</span>
        <span>
          <Price
            fontWeight="normal"
            amount={priceWithoutFees}
            shouldDisplayFiatPrice={true}
          />
        </span>
      </div>
      <div className="flex flex-col justify-between sm:flex-row">
        <span>Total fees ({sumOfFeesPercentages}%):</span>
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
            amount={transactionPrice || 0}
            shouldDisplayFiatPrice={true}
          />
        </span>
      </div>
    </div>
  )
}
