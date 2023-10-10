import { useMutation, useQueryClient } from "@tanstack/react-query"
import { splitSignature } from "ethers/lib/utils"

import { useSigner } from "../../lib/web3/auth"
import { getFirstListing } from "../alembic/offers"

import { comethMarketplaceClient } from "../alembic/client"
import {
  AssetWithTradeData,
  CancelOrderRequest,
} from "@alembic/nft-api-sdk"
import { toast } from "@/components/ui/toast/use-toast"
import { handleOrderbookError } from "../errors"

export const useCancelListing = () => {
  const signer = useSigner()
  const client = useQueryClient()

  return useMutation(
    ["cancelListing"],
    async (asset: AssetWithTradeData) => {
      const nonce = (await getFirstListing(asset.tokenId)).nonce
      if (!nonce) throw new Error("No nonce found on asset")

      try {
        const signedPrefix = await signer!.signMessage(`Nonce: ${nonce}`)
        const signature = splitSignature(signedPrefix)
        const { r, s, v } = signature

        const body: CancelOrderRequest = {
          signature: {
            signatureType: 2,
            r,
            s,
            v,
          },
        }

        return await comethMarketplaceClient.order.cancelOrder(nonce, body)
      } catch (e) {
        handleOrderbookError(e, {
          400: "Bad request",
          404: "Order not found",
          500: "Internal orderbook server error",
        })
      }
    },
    {
      onSuccess: (_, asset) => {
        client.refetchQueries(["alembic", "assets", asset.tokenId])
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