import { manifest } from "@/manifests"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BigNumber } from "ethers"

import { useSigner } from "@/lib/web3/auth"
import { toast } from "@/components/ui/toast/use-toast"
import { useWalletAdapter } from "@/app/adapters/use-wallet-adapter"

import { useGetCollection } from "../cometh-marketplace/collection"
import { handleOrderbookError } from "../errors"
import { useBuildBuyOfferOrder } from "./build-buy-offer-order"
import { useSignOrder } from "./sign-order"

export type MakeBuyOfferOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
}

export const useMakeBuyOfferAsset = () => {
  const client = useQueryClient()
  const buildSignBuyOfferOrder = useBuildBuyOfferOrder()
  const signBuyOfferOrder = useSignOrder()
  const signer = useSigner()
  const { data: collection } = useGetCollection()

  const { getWalletTxs } = useWalletAdapter()

  return useMutation(
    ["make-buy-offer-asset"],
    async ({ asset, price, validity }: MakeBuyOfferOptions) => {
      if (!collection) throw new Error("Could not get collection")

      const order = buildSignBuyOfferOrder({
        asset,
        price,
        validity,
        collection,
      })
      if (!order) throw new Error("Could not build order")

      const signedOrder = await signBuyOfferOrder({ order })

      return await getWalletTxs()?.makeBuyOffer({
        asset,
        signer,
        signedOrder,
        order,
      })
    },
    {
      onSuccess: (_, { asset }) => {
        client.invalidateQueries(["cometh", "search"]) // TODO: optimize this, just invalidate current asset
        client.invalidateQueries(["cometh", "assets", asset.tokenId])
        client.invalidateQueries(["cometh", "received-buy-offers", asset.owner])
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
