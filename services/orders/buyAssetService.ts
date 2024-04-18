import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccount, usePublicClient } from "wagmi"

import { useInvalidateAssetQueries } from "@/components/marketplace/asset/AssetDataHook"

import { getFirstListing } from "../cometh-marketplace/buyOffersService"
import { useFillSignedOrder } from "../exchange/fillSignedOrderService"
import { getViemSignedOrderFromOrder } from "../exchange/viemOrderHelper"

export type BuyAssetOptions = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
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
    mutationFn: async ({ asset, quantity }: BuyAssetOptions) => {
      if (!viewerAddress || !viemPublicClient)
        throw new Error("Could not initialize SDK")

      const order = await getFirstListing(asset.tokenId)
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
