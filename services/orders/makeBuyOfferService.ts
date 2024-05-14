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
import { useBuildOrder } from "./buildOfferOrderService"
import { usePresignOrder } from "./buyOfferService"

export type MakeBuyOfferOptions = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
  price: BigNumber
  quantity: BigInt
  validity: string
}

export const useMakeBuyOfferAsset = (
  asset: AssetWithTradeData | SearchAssetWithTradeData
) => {
  const buildSignBuyOfferOrder = useBuildOrder({
    tradeDirection: TradeDirection.BUY,
  })
  const { data: collection } = useGetCollection(
    asset.contractAddress as Address
  )
  const invalidateAssetQueries = useInvalidateAssetQueries()
  const signer = useEthersSigner()

  const { presignOrder: buyOffer } = usePresignOrder()

  return useMutation({
    mutationKey: ["make-buy-offer-asset"],
    mutationFn: async ({ asset, price, validity, quantity }: MakeBuyOfferOptions) => {
      if (!collection) throw new Error("Could not get collection")

      const order = buildSignBuyOfferOrder({
        asset,
        price,
        validity,
        collection,
        quantity: quantity.toString()
      })

      if (!order) throw new Error("Could not build order")
      if (!signer) throw new Error("Could not get signer")

      return await buyOffer({
        asset,
        signer,
        order,
      })
    },

    onSuccess: (_, { asset }) => {
      invalidateAssetQueries(
        asset.contractAddress as Address,
        asset.tokenId,
        asset.owner
      )
      toast({
        title: "Your offer has been submitted.",
      })
    },
  })
}
