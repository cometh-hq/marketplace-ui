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
        queryKey: ["cometh", "searchOrders", contractAddress],
      })
      client.invalidateQueries({
        queryKey: ["cometh", "assetTransfers", tokenId],
      })
      client.invalidateQueries({ queryKey: ["cometh", "search"] })
      if (ownerBeforeUpdate) {
        client.invalidateQueries({
          queryKey: ["cometh", "received-buy-offers", ownerBeforeUpdate],
        })
      }
    },
    [client]
  )
}
