import { useMutation } from "@tanstack/react-query"
import { UserFacingERC721AssetDataSerializedV4 } from "@traderxyz/nft-swap-sdk"

import { useNFTSwapv4 } from "../../lib/web3/nft-swap-sdk"
import { useAccount } from "wagmi"

export type UseApproveCollectionParams = {
  tokenId: string | number
  tokenAddress: string
  onSuccess?: () => void
}

export const useApproveCollection = ({
  tokenId,
  tokenAddress,
  onSuccess,
}: UseApproveCollectionParams) => {
  const nftSwapSdk = useNFTSwapv4()
  const account = useAccount()
  const viewerAddress = account.address

  return useMutation({
    mutationFn: async () => {
      if (!nftSwapSdk || !viewerAddress) throw new Error("SDK not initialized")
      const item: UserFacingERC721AssetDataSerializedV4 = {
        tokenAddress: tokenAddress,
        tokenId: tokenId.toString(),
        type: "ERC721",
      }
      return nftSwapSdk.approveTokenOrNftByAsset(item, viewerAddress)
    },

    onSuccess,
  })
}
