import { useMemo } from "react"
import {
  AssetOwners,
  AssetWithTradeData,
  SearchAssetWithTradeData,
  TokenType,
} from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"

import { comethMarketplaceClient } from "@/lib/clients"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"

export const useAssetOwners = (contractAddress: string, assetId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["cometh", "asset-owners", contractAddress, assetId],
    queryFn: async () => {
      const response: AssetOwners =
        await comethMarketplaceClient.asset.getAssetOwners(
          contractAddress,
          assetId,
          undefined,
          999999
        )
      return response
    },
  })

  return {
    data: data ?? [],
    isLoading,
  }
}

export const useAssetOwnershipByOwner = (
  contractAddress: string,
  assetId: string,
  ownerAddress?: string
) => {
  const { data, isLoading } = useQuery({
    queryKey: [
      "cometh",
      "asset-quantity-by-owner",
      contractAddress,
      assetId,
      ownerAddress,
    ],
    queryFn: async () => {
      if (!ownerAddress) return null
      const owners: AssetOwners =
        await comethMarketplaceClient.asset.getAssetOwners(
          contractAddress,
          assetId,
          ownerAddress,
          999999
        )
      return owners[0] || null
    },
  })

  return {
    data,
    isLoading,
  }
}

export const useAssetOwnedQuantity = (
  asset: AssetWithTradeData | SearchAssetWithTradeData
) => {
  const account = useAccount()
  const isErc1155 = useAssetIs1155(asset)
  const { data, isLoading } = useAssetOwnershipByOwner(
    asset.contractAddress,
    asset.tokenId,
    isErc1155 ? account.address : undefined
  )

  const assetOwnedQuantity = useMemo(() => {
    if (isErc1155) {
      return data?.quantity ?? 0
    } else {
      return asset.owner?.toLowerCase() === account.address?.toLowerCase()
        ? 1
        : 0
    }
  }, [data?.quantity, asset.owner, account.address, isErc1155])

  return assetOwnedQuantity
}

export const useIsViewerAnOwner = (
  asset: AssetWithTradeData | SearchAssetWithTradeData
) => {
  const assetOwnedQuantity = useAssetOwnedQuantity(asset)
  return BigInt(assetOwnedQuantity) > BigInt(0)
}
