import { AssetWithTradeData, CancelOrderRequest } from "@alembic/nft-api-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { splitSignature } from "ethers/lib/utils"

import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { toast } from "@/components/ui/toast/use-toast"

import { useIsComethWallet, useSigner } from "../../lib/web3/auth"
import { comethMarketplaceClient } from "../alembic/client"
import { getFirstListing } from "../alembic/offers"
import { handleOrderbookError } from "../errors"

export const useCancelListing = () => {
  const isComethWallet = useIsComethWallet()
  const sdk = useNFTSwapv4()
  const signer = useSigner()
  const client = useQueryClient()

  return useMutation(
    ["cancelListing"],
    async (asset: AssetWithTradeData) => {
      const nonce = (await getFirstListing(asset.tokenId)).nonce
      if (!nonce) throw new Error("No nonce found on asset")

      if (isComethWallet) {
        const tx = await sdk?.cancelOrder(nonce, "ERC721")
        const txReceipt = await tx?.wait()

        return txReceipt
      } else {
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
      }
    },
    {
      onSuccess: (_, asset) => {
        client.refetchQueries(["alembic", "assets", asset.tokenId])
        toast({
          title: "Your order has been canceled.",
        })
      },
      onError: (error: any) => {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: handleOrderbookError(error, {
            400: "Bad request",
            404: "Order not found",
            500: "Internal orderbook server error",
          }),
        })
      },
    }
  )
}
