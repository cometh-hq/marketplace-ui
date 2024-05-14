import { useMemo } from "react"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { useMutation } from "@tanstack/react-query"
import { Address, isAddressEqual } from "viem"
import { useAccount, usePublicClient } from "wagmi"

import { toast } from "@/components/ui/toast/hooks/useToast"
import { useInvalidateAssetQueries } from "@/components/marketplace/asset/AssetDataHook"

import { useIsViewerAnOwner } from "../cometh-marketplace/assetOwners"
import { useFillSignedOrder } from "../exchange/fillSignedOrderService"
import { getViemSignedOrderFromOrder } from "../exchange/viemOrderHelper"

export type AcceptBuyOfferOptions = {
  offer: OrderWithAsset
  quantity: bigint
}

export type UseCanAcceptBuyOfferParams = {
  offer: OrderWithAsset
}

export const useCanAcceptBuyOffer = ({ offer }: UseCanAcceptBuyOfferParams) => {
  const account = useAccount()
  const viewer = account.address?.toLowerCase() as Address
  const isViewerAnOwner = useIsViewerAnOwner(offer.asset)
  return useMemo(() => {
    if (!viewer) return false
    if (isAddressEqual(viewer, offer.maker.toLowerCase() as Address))
      return false
    return isViewerAnOwner
  }, [viewer, offer, isViewerAnOwner])
}

export const useAcceptBuyOffer = () => {
  const invalidateAssetQueries = useInvalidateAssetQueries()
  const fillOrder = useFillSignedOrder()
  const viemPublicClient = usePublicClient()

  return useMutation({
    mutationKey: ["accept-buy-offer"],
    mutationFn: async ({ offer, quantity }: AcceptBuyOfferOptions) => {
      if (!viemPublicClient) throw new Error("Could not initialize SDK")

      const signedOrder = getViemSignedOrderFromOrder(offer)

      const fillTxHash = await fillOrder(
        signedOrder,
        quantity,
        quantity * BigInt(offer.totalUnitPrice)
      )

      if (!fillTxHash) {
        throw new Error("Could not fill order")
      }

      const fillTxReceipt = await viemPublicClient.waitForTransactionReceipt({
        hash: fillTxHash,
      })

      console.log(
        `🎉 🥳 Order filled (accept-buy-offer). TxHash: ${fillTxReceipt.transactionHash}`
      )
      return fillTxReceipt
    },

    onSuccess: (_, { offer }) => {
      invalidateAssetQueries(
        offer.asset?.contractAddress as Address,
        offer.asset?.tokenId || "",
        offer.asset?.owner || ""
      )
      toast({
        title: "Purchased order filled!",
      })
    },
  })
}
