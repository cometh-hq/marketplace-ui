import { manifest } from "@/manifests"
import { UserFacingERC721AssetDataSerializedV4 } from "@traderxyz/nft-swap-sdk"
import { Address, useQuery } from "wagmi"

import { useNFTSwapv4 } from "../../lib/web3/nft-swap-sdk"

export type FetchHasApprovedCollectionParams = {
  address: Address
  tokenId: string | number
  sdk: NonNullable<ReturnType<typeof useNFTSwapv4>>
  contractAddress: Address
}

export const fetchHasApprovedCollection = async ({
  address,
  tokenId,
  sdk,
  contractAddress,
}: FetchHasApprovedCollectionParams) => {
  try {
    const item: UserFacingERC721AssetDataSerializedV4 = {
      tokenAddress: contractAddress,
      tokenId: tokenId.toString(),
      type: "ERC721",
    }
    
    return (await sdk.loadApprovalStatus(item, address)).contractApproved
  } catch (error) {
    console.error('error in try/catch bis', error);
    return false;
  }
}