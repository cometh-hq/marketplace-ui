import { useMemo } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAddressEqual } from "viem"

import { BuyOffer } from "@/types/buy-offers"
import { useCurrentViewerAddress, useSigner } from "@/lib/web3/auth"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { useWalletAdapter } from "@/services/adapters/use-wallet-adapter"

export type UseCanCancelBuyOfferParams = {
  offer: BuyOffer
}

export const useCanCancelBuyOffer = ({ offer }: UseCanCancelBuyOfferParams) => {
  const viewer = useCurrentViewerAddress()
  return useMemo(() => {
    if (!viewer) return false
    if (isAddressEqual(offer.emitter.address, viewer)) return true
    return false
  }, [viewer, offer])
}

export type CancelBuyOfferParams = {
  offer: BuyOffer
}

export const useCancelBuyOffer = () => {
  const signer = useSigner()
  const client = useQueryClient()
  const nftSwapSdk = useNFTSwapv4()

  const { getWalletTxs } = useWalletAdapter()

  return useMutation({
    mutationKey: ["cancelBuyOffer"],
    mutationFn: async ({ offer }: CancelBuyOfferParams) => {
      const nonce = offer.trade.nonce

      return await getWalletTxs()?.cancelOrder({
        nonce,
        signer,
        nftSwapSdk,
      })
    },

    onSuccess: (_, { offer }) => {
      client.refetchQueries({
        queryKey: ["cometh", "assets", offer.asset?.tokenId],
      })
      client.invalidateQueries({
        queryKey: ["cometh", "received-buy-offers", offer.owner.address],
      })
      client.invalidateQueries({
        queryKey: ["cometh", "sent-buy-offers", offer.emitter.address],
      })
    }
  })
}
