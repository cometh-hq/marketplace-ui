import { useMemo } from "react"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import {
  SearchFilledEventsRequest,
  SearchOrdersRequest,
} from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"
import { Address } from "viem"

import { calculateFeesAmount, totalFeesFromCollection } from "@/lib/utils/fees"

import {
  isFilledEventActivity,
  isOrderActivity,
  isTransferActivity,
} from "./activityHelper"
import { AssetActivity } from "./AssetActivityTypes"

export const useActivityContractAddress = (activity: AssetActivity) => {
  return useMemo(() => {
    if (isOrderActivity(activity)) {
      return activity.order.tokenAddress
    } else if (isTransferActivity(activity)) {
      return activity.transfer.contractAddress
    } else if (isFilledEventActivity(activity)) {
      return activity.filledEvent.tokenAddress
    } else {
      throw new Error("Unknown activity type")
    }
  }, [activity])
}

export const useActivityCollection = (activity: AssetActivity) => {
  const activityContractAddress = useActivityContractAddress(activity)
  const { data: collection } = useGetCollection(
    activityContractAddress as Address
  )
  return collection
}

export const useActivityUnitPrice = (activity: AssetActivity) => {
  const collection = useActivityCollection(activity)

  // Hack to compute unit price
  // If collection fees were updated since the filled event happen, this computation will be wrong
  // Filled event don't store the fees, so the indexer should compute them when indexed or version fees
  return useMemo(() => {
    if (!collection || isTransferActivity(activity)) {
      return null
    }

    if (isFilledEventActivity(activity)) {
      const filledEvent = activity.filledEvent
      const fees = collection.collectionFees.map((fee) => {
        return {
          amount: calculateFeesAmount(
            filledEvent.erc20FillAmount,
            fee.feePercentage
          ),
          recipient: fee.recipientAddress,
        }
      })
      const feesSum = totalFeesFromCollection(fees)
      return BigNumber.from(filledEvent.erc20FillAmount)
        .add(feesSum)
        .div(filledEvent.fillAmount)
        .toString()
    } else if (isOrderActivity(activity)) {
      return activity.order.totalUnitPrice
    }
  }, [activity, collection])
}
