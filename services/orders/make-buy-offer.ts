import { AssetWithTradeData, TradeDirection } from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"

import { useSigner } from "@/lib/web3/auth"
import { toast } from "@/components/ui/toast/use-toast"
import { useWalletAdapter } from "@/app/adapters/use-wallet-adapter"

import { useGetCollection } from "../cometh-marketplace/collection"
import { useBuildOfferOrder } from "./build-offer-order"

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
  const signer = useSigner()

  const { getWalletTxs } = useWalletAdapter()

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

      return await getWalletTxs()?.makeBuyOffer({
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
