import { manifest } from "@/manifests"
import {
  AssetWithTradeData,
  NewOrder,
  TokenType,
  TradeDirection,
} from "@alembic/nft-api-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ERC721OrderStruct } from "@traderxyz/nft-swap-sdk"
import { BigNumber } from "ethers"
import { DateTime } from "luxon"

import { IZeroEx__factory } from "@/lib/generated/contracts/factories/IZeroEx__factory"
import { useIsComethWallet, useSigner } from "@/lib/web3/auth"
import { toast } from "@/components/ui/toast/use-toast"

import { comethMarketplaceClient } from "../cometh-marketplace/client"
import { useGetCollection } from "../cometh-marketplace/collection"
import { handleOrderbookError } from "../errors"
import { useBuildSellOrder } from "./build-sell-order"
import { useSignSellOrder } from "./sign-sell-order"

export type SellAssetOptions = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
}

export const useSellAsset = () => {
  const buildSignSellOrder = useBuildSellOrder()
  const signSellOrder = useSignSellOrder()
  const client = useQueryClient()
  const signer = useSigner()
  const isComethWallet = useIsComethWallet()

  const { data: collection } = useGetCollection()

  return useMutation(
    ["sell-asset"],
    async ({ asset, price, validity }: SellAssetOptions) => {
      if (!collection) throw new Error("Could not get collection")

      const order = buildSignSellOrder({ asset, price, validity, collection })
      if (!order) throw new Error("Could not build order")

      if (isComethWallet) {
        const contract = IZeroEx__factory.connect(
          process.env.NEXT_PUBLIC_ZERO_EX_CONTRACT_ADDRESS!,
          signer
        )

        const tx = await contract.preSignERC721Order(order as ERC721OrderStruct)
        const txResponse = await tx.wait()

        return txResponse
      } else {
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
      }
    },
    {
      onSuccess: (_, { asset }) => {
        client.invalidateQueries(["cometh", "search"]) // TODO: optimize this, just invalidate the asset
        client.invalidateQueries(["cometh", "assets", asset.tokenId])
        toast({
          title: "Your asset is now listed for sale.",
        })
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
