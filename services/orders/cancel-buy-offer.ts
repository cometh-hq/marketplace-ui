import { useMemo } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAddressEqual } from "viem"

import { BuyOffer } from "@/types/buy-offers"
import { useCurrentViewerAddress, useSigner } from "@/lib/web3/auth"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { toast } from "@/components/ui/toast/use-toast"

import { handleOrderbookError } from "../errors"
import { useWalletsAdapterContext } from "@/providers/wallets-adapter"

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
  const { getWalletTxs } = useWalletsAdapterContext()
  const walletAdapter = getWalletTxs()

  return useMutation(
    ["cancelBuyOffer"],
    async ({ offer }: CancelBuyOfferParams) => {
      const nonce = offer.trade.nonce

      return await walletAdapter?.cancelOrder({
        nonce,
        signer,
        nftSwapSdk,
      })
    },
    {
      onSuccess: (_, { offer }) => {
        client.refetchQueries(["cometh", "assets", offer.asset?.tokenId])
        client.invalidateQueries([
          "cometh",
          "received-buy-offers",
          offer.owner.address,
        ])
        client.invalidateQueries([
          "cometh",
          "sent-buy-offers",
          offer.emitter.address,
        ])
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: handleOrderbookError(error, {
            400: "Bad request",
            404: "Order not found",
            401: "Unauthorized",
            403: "Forbidden",
            500: "Internal orderbook server error",
          }),
        })
      },
    }
  )
}
