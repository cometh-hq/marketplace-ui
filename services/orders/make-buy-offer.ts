import { AssetWithTradeData, TradeDirection } from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BigNumber } from "ethers"

import { useSigner } from "@/lib/web3/auth"
import { toast } from "@/components/ui/toast/use-toast"
import { useWalletAdapter } from "@/app/adapters/use-wallet-adapter"

import { useGetCollection } from "../cometh-marketplace/collection"
import { handleOrderbookError } from "../errors"
import { useBuildOfferOrder } from "./build-offer-order"

export type MakeBuyOfferOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
}

export const useMakeBuyOfferAsset = () => {
  const client = useQueryClient()
  const buildSignBuyOfferOrder = useBuildOfferOrder({
    tradeDirection: TradeDirection.BUY,
  })
  const signer = useSigner()
  const { data: collection } = useGetCollection()

  const { getWalletTxs } = useWalletAdapter()

  return useMutation({
    mutationKey: ["make-buy-offer-asset"],
    mutationFn: async ({ asset, price, validity }: MakeBuyOfferOptions) => {
      if (!collection) throw new Error("Could not get collection")

      console.log("asset in make-buy-offer-asset", asset)
      console.log("price in make-buy-offer-asset", price)

      const order = buildSignBuyOfferOrder({
        asset,
        price,
        validity,
        collection,
      })

      console.log("order in make-buy-offer-asset", order)
      if (!order) throw new Error("Could not build order")

      return await getWalletTxs()?.makeBuyOffer({
        asset,
        signer,
        order,
      })
    },

    onSuccess: (_, { asset }) => {
      console.log("asset in make-buy-offer-asset", asset)
      client.invalidateQueries({ queryKey: ["cometh", "search"] }) // TODO: optimize this, just invalidate current asset
      client.invalidateQueries({
        queryKey: ["cometh", "assets", asset.tokenId],
      })
      client.invalidateQueries({
        queryKey: ["cometh", "received-buy-offers", asset.owner],
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: handleOrderbookError(error, {
          400: "Bad request",
          500: "Internal orderbook server error",
        }),
      })
    },
  })
}
