import {
  AssetWithTradeData,
  OrderWithAsset,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccount, usePublicClient } from "wagmi"

import { OrderAsset } from "@/types/assets"
import { useInvalidateAssetQueries } from "@/components/marketplace/asset/AssetDataHook"

import { useFillSignedOrder } from "../exchange/fillSignedOrderService"
import { getViemSignedOrderFromOrder } from "../exchange/viemOrderHelper"
import { waitForTransferTxIndexingAndStats } from "./indexingProgressService"

export type BuyAssetOptions = {
  asset: AssetWithTradeData | SearchAssetWithTradeData | OrderAsset
  order: OrderWithAsset
  quantity: bigint
}

export const useBuyAsset = () => {
  const client = useQueryClient()
  const account = useAccount()
  const viewerAddress = account.address
  const invalidateAssetQueries = useInvalidateAssetQueries()
  const fillOrder = useFillSignedOrder()
  const viemPublicClient = usePublicClient()

  return useMutation({
    mutationKey: ["buy-asset"],
    mutationFn: async ({ order, quantity }: BuyAssetOptions) => {
      if (!viewerAddress || !viemPublicClient)
        throw new Error("Could not initialize SDK")

      const signedOrder = getViemSignedOrderFromOrder(order)

      const fillTxHash = await fillOrder(
        signedOrder,
        quantity,
        quantity * BigInt(order.totalUnitPrice)
      )

      if (!fillTxHash) {
        throw new Error("Could not fill order")
      }

      const fillTxReceipt = await viemPublicClient.waitForTransactionReceipt({
        hash: fillTxHash,
      })
      await waitForTransferTxIndexingAndStats(fillTxHash)
      
      console.log(
        `🎉 🥳 Order filled (buy-asset). TxHash: ${fillTxReceipt.transactionHash}`,
        fillTxReceipt
      )
      return fillTxReceipt
    },
    onSuccess: (_, { asset }) => {
      invalidateAssetQueries(
        asset.contractAddress as string,
        asset.tokenId,
        asset.owner
      )
      client.invalidateQueries({ queryKey: ["cometh", "search"] })
    },
  })
}
