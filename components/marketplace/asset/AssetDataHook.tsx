import { useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"

export const useInvalidateAssetQueries = () => {
  const client = useQueryClient()

  return useCallback(
    (
      contractAddress: string,
      tokenId: string,
      ownerBeforeUpdate: string | null
    ) => {
      client.invalidateQueries({
        queryKey: ["cometh", "assets", tokenId],
      })
      client.invalidateQueries({
        queryKey: ["cometh", "getAsset", tokenId],
      })
      client.invalidateQueries({
        queryKey: ["cometh", "searchOrders", contractAddress],
      })
      client.invalidateQueries({
        queryKey: ["cometh", "assetTransfers", contractAddress, tokenId],
      })
      client.invalidateQueries({
        queryKey: ["cometh", "asset-owners", contractAddress, tokenId],
      })
      client.invalidateQueries({
        queryKey: [
          "cometh",
          "asset-quantity-by-owner",
          contractAddress,
          tokenId,
        ],
      })
      client.invalidateQueries({ queryKey: ["cometh", "search"] })
    },
    [client]
  )
}
