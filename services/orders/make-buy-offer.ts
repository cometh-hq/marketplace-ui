import { manifest } from "@/manifests"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { DateTime } from "luxon"

import { useBuildBuyOfferOrder } from "./build-buy-offer-order"
import { useSignBuyOfferOrder } from "./sign-buy-offer-order"

import { comethMarketplaceClient } from "../alembic/client"
import {
  AssetWithTradeData,
  NewOrder,
  TokenType,
  TradeDirection,
} from "@alembic/nft-api-sdk"
import { handleOrderbookError } from "../errors"
import { toast } from "@/components/ui/toast/use-toast"
import { useGetCollection } from "../alembic/collection"

export type MakeBuyOfferOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
}

export const useMakeBuyOfferAsset = () => {
  const buildSignBuyOfferOrder = useBuildBuyOfferOrder()
  const signBuyOfferOrder = useSignBuyOfferOrder()
  const client = useQueryClient()

  const { data: collection } = useGetCollection()
  
  return useMutation(
    ["make-buy-offer-asset"],
    async ({ asset, price, validity }: MakeBuyOfferOptions) => {
      if (!collection) throw new Error("Could not get collection")
      
      const order = buildSignBuyOfferOrder({ asset, price, validity, collection })
      if (!order) throw new Error("Could not build order")

      try {
        const signedOrder = await signBuyOfferOrder({ order })

        const buyOffer: NewOrder = {
          tokenAddress: manifest.contractAddress,
          tokenId: asset.tokenId,
          tokenProperties: [],
          tokenQuantity: BigNumber.from(1).toString(),
          tokenType: TokenType.ERC721,
          direction: TradeDirection.BUY,
          erc20Token: order.erc20Token,
          erc20TokenAmount: order.erc20TokenAmount,
          expiry: DateTime.fromSeconds(+order.expiry).toString(),
          fees: order.fees,
          maker: order.maker,
          nonce: order.nonce,
          signature: signedOrder.signature,
          signedAt: DateTime.now().toString(),
          taker: order.taker,
        }

        return await comethMarketplaceClient.order.createOrder(buyOffer)
      } catch (e) {
        handleOrderbookError(e, {
          400: "Bad request",
          500: "Internal orderbook server error",
        })
      }
    },
    {
      onSuccess: (_, { asset }) => {
        client.invalidateQueries(["alembic", "assets", asset.tokenId])
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        })
      }
    }
  )
}