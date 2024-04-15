import { useMemo } from "react"
import { OrderWithAsset, TokenType, TradeDirection } from "@cometh/marketplace-sdk"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  SignedERC721OrderStruct,
  SignedERC1155OrderStruct,
  SignedNftOrderV4,
} from "@traderxyz/nft-swap-sdk"
import { ContractTransaction } from "ethers"
import { Address, isAddressEqual } from "viem"
import { useAccount } from "wagmi"

import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { toast } from "@/components/ui/toast/hooks/useToast"
import { useInvalidateAssetQueries } from "@/components/marketplace/asset/AssetDataHook"
import { getSDKSignedOrderFromOrder } from "./orderHelper"

export type AcceptBuyOfferOptions = {
  offer: OrderWithAsset
}

export type UseCanAcceptBuyOfferParams = {
  offer: OrderWithAsset
}

export const useCanAcceptBuyOffer = ({ offer }: UseCanAcceptBuyOfferParams) => {
  const account = useAccount()
  const viewer = account.address?.toLowerCase() as Address
  return useMemo(() => {
    if (!viewer) return false
    if (isAddressEqual(viewer, offer.maker.toLowerCase() as Address))
      return false
    if (
      offer.asset &&
      offer.asset.owner !== null &&
      isAddressEqual(offer.asset.owner as Address, viewer)
    )
      return false
    return true
  }, [viewer, offer])
}



export const useAcceptBuyOffer = () => {
  const nftSwapSdk = useNFTSwapv4()
  const invalidateAssetQueries = useInvalidateAssetQueries()

  return useMutation({
    mutationKey: ["accept-buy-offer"],
    mutationFn: async ({ offer }: AcceptBuyOfferOptions) => {
      if (!nftSwapSdk) throw new Error("Could not initialize SDK")

      const signedOrder = getSDKSignedOrderFromOrder(offer)

      const fillTx: ContractTransaction =
        await nftSwapSdk.fillSignedOrder(signedOrder)

      const fillTxReceipt = await fillTx.wait()
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
