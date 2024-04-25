import { TransfersSearch } from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

import { comethMarketplaceClient } from "@/lib/clients"

export type fetchAssetOptions = {
  contractAddress: Address
  tokenId: string
}

export const fetchAssetTransfers = async ({
  contractAddress,
  tokenId,
}: fetchAssetOptions) => {
  return comethMarketplaceClient.transfer.getAssetTransfers(
    contractAddress,
    tokenId
  )
}

export const useAssetTransfers = (
  contractAddress: Address,
  tokenId: string
) => {
  return useQuery({
    queryKey: ["cometh", "assetTransfers", contractAddress, tokenId],
    queryFn: () => {
      return fetchAssetTransfers({ contractAddress, tokenId })
    },
  })
}

export const useSearchTransfers = (searchTransfersParams: TransfersSearch) => {
  return useQuery({
    queryKey: [
      "cometh",
      "assetTransfers",
      searchTransfersParams.tokenAddress,
      JSON.stringify(searchTransfersParams),
    ],
    queryFn: () =>
      comethMarketplaceClient.transfer.transferSearch(searchTransfersParams),
  })
}
