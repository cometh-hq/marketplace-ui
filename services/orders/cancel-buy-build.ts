import { useMemo } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { splitSignature } from "ethers/lib/utils"
import { isAddressEqual } from "viem"

import { BuyOffer } from "@/types/buy-offers"
import { useCurrentViewerAddress, useSigner } from "@/lib/web3/auth"

import { comethMarketplaceClient } from "../alembic/client"
import { CancelOrderRequest } from "@alembic/nft-api-sdk"
import { toast } from "@/components/ui/toast/use-toast"
import { handleOrderbookError } from "../errors"

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

  return useMutation(
    ["cancelBuyOffer"],
    async ({ offer }: CancelBuyOfferParams) => {
      const nonce = offer.trade.nonce
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
          401: "Unauthorized",
          403: "Forbidden",
          500: "Internal orderbook server error",
        })
      }
    },
    {
      onSuccess: (_, { offer }) => {
        client.refetchQueries(["alembic", "assets", offer.asset?.tokenId])
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
