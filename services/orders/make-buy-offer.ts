import { useEthersSigner } from "@/providers/authentication/viemToEthersHelper"
import { AssetWithTradeData, TradeDirection } from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"

import { toast } from "@/components/ui/toast/use-toast"

import { useGetCollection } from "../cometh-marketplace/collection"
import { useBuildOfferOrder } from "./build-offer-order"
import { useBuyOffer } from "./buy-offer"

export type MakeBuyOfferOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
}

export const useMakeBuyOfferAsset = (asset: AssetWithTradeData) => {
  const client = useQueryClient()
  const buildSignBuyOfferOrder = useBuildOfferOrder({
    tradeDirection: TradeDirection.BUY,
  })
  const { data: collection } = useGetCollection(
    asset.contractAddress as Address
  )
  const signer = useEthersSigner()

  const { buyOffer } = useBuyOffer()

  return useMutation({
    mutationKey: ["make-buy-offer-asset"],
    mutationFn: async ({ asset, price, validity }: MakeBuyOfferOptions) => {
      if (!collection) throw new Error("Could not get collection")

      const order = buildSignBuyOfferOrder({
        asset,
        price,
        validity,
        collection,
      })

      if (!order) throw new Error("Could not build order")
      if(!signer) throw new Error("Could not get signer")

      return await buyOffer({
        asset,
        signer,
        order,
      })
    },

    onSuccess: (_, { asset }) => {
      client.invalidateQueries({ queryKey: ["cometh", "search"] }) // TODO: optimize this, just invalidate current asset
      client.invalidateQueries({
        queryKey: ["cometh", "assets", asset.tokenId],
      })
      client.invalidateQueries({
        queryKey: ["cometh", "received-buy-offers", asset.owner],
      })
      toast({
        title: "Your offer has been submitted.",
      })
    },
  })
}
