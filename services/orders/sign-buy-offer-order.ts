import { useCallback } from "react"
import { NftOrderV4Serialized } from "@traderxyz/nft-swap-sdk"

import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"

export type SignBuyOfferOrderOptions = {
  order: NftOrderV4Serialized
}

export const useSignBuyOfferOrder = () => {
  const sdk = useNFTSwapv4()

  const signOrder = useCallback(
    async ({ order }: SignBuyOfferOrderOptions) => {
      if (!sdk) throw new Error("SDK not initialized")
      return sdk.signOrder(order)
    },
    [sdk]
  )

  return signOrder
}
