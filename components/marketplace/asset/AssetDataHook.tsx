import { useCallback } from "react"
import {
  useERC20Balance,
  useNativeBalance,
} from "@/services/balance/balanceService"
import { useQueryClient } from "@tanstack/react-query"

import globalConfig from "@/config/globalConfig"

export const useInvalidateAssetQueries = () => {
  const client = useQueryClient()
  const { refreshBalance: refreshNativeBalance } = useNativeBalance()
  const { refreshBalance: refreshErc20Balance } = useERC20Balance(
    globalConfig.ordersErc20.address
  )

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
        queryKey: ["cometh", "searchOrders"],
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
      refreshNativeBalance()
      refreshErc20Balance()
      if (ownerBeforeUpdate) {
        client.invalidateQueries({
          queryKey: ["cometh", "received-buy-offers", ownerBeforeUpdate],
        })
      }
    },
    [client, refreshNativeBalance, refreshErc20Balance]
  )
}
