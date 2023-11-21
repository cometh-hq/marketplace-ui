import { AssetWithTradeData } from "@alembic/nft-api-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { toast } from "@/components/ui/toast/use-toast"

import { useSigner } from "../../lib/web3/auth"
import { getFirstListing } from "../cometh-marketplace/offers"
import { handleOrderbookError } from "../errors"
import { useWalletAdapter } from "@/app/adapters/use-wallet-adapter"

export const useCancelListing = () => {
  const client = useQueryClient()
  const nftSwapSdk = useNFTSwapv4()
  const signer = useSigner()

  const { getWalletTxs } = useWalletAdapter()

  return useMutation(
    ["cancelListing"],
    async (asset: AssetWithTradeData) => {
      const nonce = (await getFirstListing(asset.tokenId)).nonce
      if (!nonce) throw new Error("No nonce found on asset")

      return await getWalletTxs()?.cancelOrder({ nonce, signer, nftSwapSdk })
    },
    {
      onSuccess: (_, asset) => {
        client.refetchQueries(["cometh", "assets", asset.tokenId])
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
