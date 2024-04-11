import { useEthersSigner } from "@/providers/authentication/viemToEthersHelper"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
  TradeDirection,
} from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"

import { toast } from "@/components/ui/toast/hooks/useToast"
import { useInvalidateAssetQueries } from "@/components/marketplace/asset/AssetDataHook"

import { useGetCollection } from "../cometh-marketplace/collectionService"
import { useBuildOfferOrder } from "./buildOfferOrderService"
import { usePresignOrder } from "./buyOfferService"

export type SellAssetOptions = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
  price: BigNumber
  quantity: string
  validity: string
}

export const useSellAsset = (
  asset: AssetWithTradeData | SearchAssetWithTradeData
) => {
  const buildSignSellOrder = useBuildOfferOrder({
    tradeDirection: TradeDirection.SELL,
  })
  const signer = useEthersSigner()
  const { data: collection } = useGetCollection(
    asset.contractAddress as Address
  )
  const invalidateAssetQueries = useInvalidateAssetQueries()

  const { presignOrder } = usePresignOrder()

  return useMutation({
    mutationKey: ["sell-asset"],
    mutationFn: async ({
      asset,
      price,
      validity,
      quantity,
    }: SellAssetOptions) => {
      if (!collection) throw new Error("Could not get collection")

      const order = buildSignSellOrder({
        asset,
        price,
        validity,
        collection,
        quantity,
      })
      if (!order) throw new Error("Could not build order")
      if (!signer) throw new Error("Could not get signer")

      return await presignOrder({
        asset,
        signer,
        order,
        tradeDirection: TradeDirection.SELL,
      })
    },

    onSuccess: (_, { asset }) => {
      invalidateAssetQueries(
        asset.contractAddress as Address,
        asset.tokenId,
        asset.owner
      )
      toast({
        title: "Your asset is now listed for sale.",
      })
    },
  })
}
