import { UserFacingERC721AssetDataSerializedV4 } from "@traderxyz/nft-swap-sdk"
import { Address } from "wagmi"

import { useNFTSwapv4 } from "../../lib/web3/nft-swap-sdk"

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

    return (await nftSwapSdk.loadApprovalStatus(item, address)).contractApproved
  } catch (error) {
    console.error("error in try/catch bis", error)
    return false
  }
}
