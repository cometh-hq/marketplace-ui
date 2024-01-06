import { AssetWithTradeData, TradeDirection } from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BigNumber } from "ethers"

import { useSigner } from "@/lib/web3/auth"
import { toast } from "@/components/ui/toast/use-toast"

import { useGetCollection } from "../cometh-marketplace/collection"
import { handleOrderbookError } from "../errors"
import { useBuildSellOrder } from "./build-sell-order"
import { useWalletAdapter } from "@/app/adapters/use-wallet-adapter"

export type SellAssetOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
}

export const useSellAsset = () => {
  const buildSignSellOrder = useBuildSellOrder()
  const client = useQueryClient()
  const signer = useSigner()
  const { data: collection } = useGetCollection()

  const { getWalletTxs } = useWalletAdapter()

  return useMutation(
    ["sell-asset"],
    async ({ asset, price, validity }: SellAssetOptions) => {
      if (!collection) throw new Error("Could not get collection")

      const order = buildSignSellOrder({ asset, price, validity, collection })
      if (!order) throw new Error("Could not build order")

      return await getWalletTxs()?.makeBuyOffer({
        asset,
        signer,
        order,
        tradeDirection: TradeDirection.SELL
      })
    },
    {
      onSuccess: (_, { asset }) => {
        client.invalidateQueries(["cometh", "search"]) // TODO: optimize this, just invalidate current asset
        client.invalidateQueries(["cometh", "assets", asset.tokenId])
        toast({
          title: "Your asset is now listed for sale.",
        })
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: handleOrderbookError(error, {
            400: "Bad request",
            500: "Internal orderbook server error",
          }),
        })
      },
    }
  )
}
