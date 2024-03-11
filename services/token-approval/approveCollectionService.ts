import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { useMutation } from "@tanstack/react-query"
import { UserFacingERC721AssetDataSerializedV4 } from "@traderxyz/nft-swap-sdk"
import { Address } from "viem"
import { useAccount } from "wagmi"


export type FetchHasApprovedCollectionParams = {
  address: Address
  tokenId: string | number
  nftSwapSdk: NonNullable<ReturnType<typeof useNFTSwapv4>>
  contractAddress: Address
}

export const fetchHasApprovedCollection = async ({
  address,
  tokenId,
  nftSwapSdk,
  contractAddress,
}: FetchHasApprovedCollectionParams) => {
  try {
    const item: UserFacingERC721AssetDataSerializedV4 = {
      tokenAddress: contractAddress,
      tokenId: tokenId.toString(),
      type: "ERC721",
    }
    const approvalStatus = await nftSwapSdk.loadApprovalStatus(item, address)
    return approvalStatus.contractApproved
  } catch (error) {
    console.error("error in try/catch bis", error)
    return false
  }
}

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
