import { useMemo } from "react"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Address, isAddressEqual } from "viem"
import { useAccount } from "wagmi"

import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { useInvalidateAssetQueries } from "@/components/marketplace/asset/AssetDataHook"

import { cancelOrder } from "./cancelOrderService"

export type UseCanCancelBuyOfferParams = {
  offer: OrderWithAsset
}

export const useCanCancelBuyOffer = ({ offer }: UseCanCancelBuyOfferParams) => {
  const account = useAccount()
  const viewer = account.address
  return useMemo(() => {
    if (!viewer) return false
    if (isAddressEqual(offer.maker as Address, viewer)) return true
    return false
  }, [viewer, offer])
}

export type CancelBuyOfferParams = {
  offer: OrderWithAsset
}

export const useCancelBuyOffer = () => {
  const client = useQueryClient()
  const nftSwapSdk = useNFTSwapv4()
  const account = useAccount()
  const viewAddress = account.address
  const invalidateAssetQueries = useInvalidateAssetQueries()

  return useMutation({
    mutationKey: ["cancelBuyOffer"],
    mutationFn: async ({ offer }: CancelBuyOfferParams) => {
      const nonce = offer.nonce

      return await cancelOrder({
        nonce,
        nftSwapSdk,
        tokenType: offer.tokenType,
      })
    },

    onSuccess: (_, { offer }) => {
      invalidateAssetQueries(
        offer.asset?.contractAddress as Address,
        offer.asset?.tokenId || "",
        offer.asset?.owner || ""
      )
      client.invalidateQueries({
        queryKey: ["cometh", "sent-buy-offers", viewAddress],
      })
    },
  })
}
