import { manifest } from "@/manifests"
import {
  AssetWithTradeData,
  NewOrder,
  TokenType,
  TradeDirection,
} from '@cometh/marketplace-sdk'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { DateTime } from "luxon"

import { comethMarketplaceClient } from "../alembic/client"
import { useBuildSellOrder } from "./build-sell-order"
import { useSignSellOrder } from "./sign-sell-order"
import { handleOrderbookError } from "../errors"
import { toast } from "@/components/ui/toast/use-toast"
import { useGetCollection } from "../alembic/collection"

export type SellAssetOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
}

export const useSellAsset = () => {
  const buildSignSellOrder = useBuildSellOrder()
  const signSellOrder = useSignSellOrder()
  const client = useQueryClient()

  const { data: collection } = useGetCollection()

  return useMutation(
    ["sell-asset"],
    async ({ asset, price, validity }: SellAssetOptions) => {
      if (!collection) throw new Error("Could not get collection")

      const order = buildSignSellOrder({ asset, price, validity, collection })
      if (!order) throw new Error("Could not build order")

      try {
        const signedOrder = await signSellOrder({ order })

        const sellOrder: NewOrder = {
          tokenAddress: manifest.contractAddress,
          tokenId: asset.tokenId,
          tokenProperties: [],
          tokenQuantity: BigNumber.from(1).toString(),
          tokenType: TokenType.ERC721,
          direction: TradeDirection.SELL,
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

        return await comethMarketplaceClient.order.createOrder(sellOrder)
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
        console.error(error)
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        })
      }
    }
  )
}
