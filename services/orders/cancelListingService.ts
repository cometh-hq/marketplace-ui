import { useEthersSigner } from "@/providers/authentication/viemToEthersHelper"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Address } from "viem"

import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { toast } from "@/components/ui/toast/hooks/useToast"
import { useInvalidateAssetQueries } from "@/components/marketplace/asset/AssetDataHook"

import { getFirstListing } from "../cometh-marketplace/buyOffersService"
import { cancelOrder } from "./cancelOrderService"

export const useCancelListing = () => {
  const nftSwapSdk = useNFTSwapv4()
  const signer = useEthersSigner()
  const invalidateAssetQueries = useInvalidateAssetQueries()

  return useMutation({
    mutationKey: ["cancelListing"],
    mutationFn: async (
      asset: AssetWithTradeData | SearchAssetWithTradeData
    ) => {
      const nonce = (await getFirstListing(asset.tokenId)).nonce
      if (!nonce) throw new Error("No nonce found on asset")
      if (!signer) throw new Error("Could not get signer")
      const tokenType = asset.tokenType
      return await cancelOrder({ nonce, nftSwapSdk, tokenType })
    },

    onSuccess: (_, asset) => {
      invalidateAssetQueries(
        asset.contractAddress as Address,
        asset.tokenId,
        asset.owner
      )
      toast({
        title: "Your order has been canceled.",
      })
    },
  })
}
