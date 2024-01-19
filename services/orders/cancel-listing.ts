import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { toast } from "@/components/ui/toast/use-toast"
import { useWalletAdapter } from "@/app/adapters/use-wallet-adapter"

import { useSigner } from "../../lib/web3/auth"
import { getFirstListing } from "../cometh-marketplace/offers"

export const useCancelListing = () => {
  const client = useQueryClient()
  const nftSwapSdk = useNFTSwapv4()
  const signer = useSigner()

  const { getWalletTxs } = useWalletAdapter()

  return useMutation({
    mutationKey: ["cancelListing"],
    mutationFn: async (asset: AssetWithTradeData) => {
      const nonce = (await getFirstListing(asset.tokenId)).nonce
      if (!nonce) throw new Error("No nonce found on asset")

      return await getWalletTxs()?.cancelOrder({ nonce, signer, nftSwapSdk })
    },

    onSuccess: (_, asset) => {
      client.refetchQueries({ queryKey: ["cometh", "assets", asset.tokenId] })
      toast({
        title: "Your order has been canceled.",
      })
    }
  })
}
