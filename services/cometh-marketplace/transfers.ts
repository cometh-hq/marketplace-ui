import {
  useQuery,
} from "@tanstack/react-query"
import { Address } from "viem"
import { comethMarketplaceClient } from "./client"

export type fetchAssetOptions = {
  contractAddress: Address
  tokenId: string
}

export const fetchAssetTransfers = async ({
  contractAddress,
  tokenId
}: fetchAssetOptions) => {
  return comethMarketplaceClient.transfer.getAssetTransfers(contractAddress, tokenId)
}

export const useAssetTransfers = (contractAddress: Address, tokenId: string) => {
  return useQuery(
    ["cometh", "assetTransfers", tokenId],
    () => {
      return fetchAssetTransfers({ contractAddress, tokenId })
    },
  )
}