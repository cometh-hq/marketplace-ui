import { manifest } from "@/manifests"
import {
  AssetWithTradeData,
} from "@alembic/nft-api-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BigNumber } from "ethers"

import { toast } from "@/components/ui/toast/use-toast"

import { useGetCollection } from "../cometh-marketplace/collection"
import { handleOrderbookError } from "../errors"
import { useBuildBuyOfferOrder } from "./build-buy-offer-order"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useSigner } from "@/lib/web3/auth"

export type MakeBuyOfferOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
}

export const useMakeBuyOfferAsset = () => {
  const buildSignBuyOfferOrder = useBuildBuyOfferOrder()
  const client = useQueryClient()
  const signer = useSigner()
  const { data: collection } = useGetCollection()
  const { getWalletTxs } = useWeb3OnboardContext()
  const walletAdapter = getWalletTxs()
  if (!walletAdapter) throw new Error("Could not get wallet adapter")

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
      
      await walletAdapter.makeBuyOffer({ asset, signer, order })
    },
    {
      onSuccess: (_, { asset }) => {
        client.invalidateQueries(["cometh", "search"]) // TODO: optimize this, just invalidate the asset
        client.invalidateQueries(["cometh", "assets", asset.tokenId])
        client.invalidateQueries(["cometh", "ReceivedBuyoffers", asset.owner])
      },
      onError: (error: Error) => {
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
