import {
  TradeDirection,
  TradeStatus,
} from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"

import { comethMarketplaceClient } from "@/lib/clients"

export async function getCheapestListing(
  tokenAddress: string,
  tokenId: string
) {
  const ordersResponse = await comethMarketplaceClient.order.searchOrders({
    tokenAddress: tokenAddress,
    tokenIds: [tokenId],
    statuses: [TradeStatus.OPEN],
    direction: TradeDirection.SELL,
    // TODO: Add proper sort
    limit: 1
  })

  const listings = ordersResponse.orders
  if (!listings?.length)
    throw new Error("Could not find any listing for this asset")

  const order = listings.sort((a, b) => {
    return +a.erc20TokenAmount - +b.erc20TokenAmount
  })[0]

  return order
}

export function useCheapestListing(tokenAddress: string, tokenId: string) {
  return useQuery({
    queryKey: ["cometh", "cheapest-listing", tokenAddress, tokenId],
    queryFn: () => getCheapestListing(tokenAddress, tokenId),
  })
}
