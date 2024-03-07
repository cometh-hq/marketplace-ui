import { AssetWithTradeData, TradeDirection } from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"

import { useSigner } from "@/lib/web3/auth"
import { toast } from "@/components/ui/toast/use-toast"

import { useGetCollection } from "../cometh-marketplace/collection"
import { useBuildOfferOrder } from "./build-offer-order"
import { useBuyOffer } from "./buy-offer"

export type SellAssetOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
}

export const useSellAsset = (asset: AssetWithTradeData) => {
  const buildSignSellOrder = useBuildOfferOrder({
    tradeDirection: TradeDirection.SELL,
  })
  const client = useQueryClient()
  const signer = useSigner()
  const { data: collection } = useGetCollection(
    asset.contractAddress as Address
  )

  const { buyOffer } = useBuyOffer()

  return useMutation({
    mutationKey: ["sell-asset"],
    mutationFn: async ({ asset, price, validity }: SellAssetOptions) => {
      if (!collection) throw new Error("Could not get collection")

      const order = buildSignSellOrder({ asset, price, validity, collection })
      if (!order) throw new Error("Could not build order")

      return await buyOffer({
        asset,
        signer,
        order,
        tradeDirection: TradeDirection.SELL,
      })
    },

    onSuccess: (_, { asset }) => {
      client.invalidateQueries({ queryKey: ["cometh", "search"] }) // TODO: optimize this, just invalidate current asset
      client.invalidateQueries({
        queryKey: ["cometh", "assets", asset.tokenId],
      })
      toast({
        title: "Your asset is now listed for sale.",
      })
    },
  })
}
