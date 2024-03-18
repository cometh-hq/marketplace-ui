import { TradeDirection, TradeStatus } from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"

import { comethMarketplaceClient } from "@/lib/clients"

export function useReceivedBuyOffers(userAddress: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["cometh", "received-buy-offers", userAddress.toLowerCase()],
    queryFn: async () => {
      const response =
        await comethMarketplaceClient.order.getOffersReceivedByAddress(
          userAddress
        )
      return (
        response.orders?.filter(
          (order) => order.direction === TradeDirection.BUY
        ) ?? []
      )
    },
    refetchInterval: 5000,
  })

  return {
    data: data ?? [],
    isLoading,
  }
}

export function useSentBuyOffers(userAddress: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["cometh", "sent-buy-offers", userAddress.toLowerCase()],
    queryFn: async () => {
      const response =
        await comethMarketplaceClient.order.getOffersSentByAddress(userAddress)
      return (
        response.orders?.filter(
          (order) => order.direction === TradeDirection.BUY
        ) ?? []
      )
    },
  })

  return {
    data: data ?? [],
    isLoading,
  }
}

export function useListings(tokenId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["cometh", "listings", tokenId],
    queryFn: async () => {
      const response = await comethMarketplaceClient.order.searchOrders({
        tokenIds: [tokenId],
        statuses: [TradeStatus.OPEN],
        direction: TradeDirection.SELL,
      })
      return response.orders
    },
  })

  return {
    data: data ?? [],
    isLoading,
  }
}

export async function getFirstListing(tokenId: string) {
  const ordersResponse = await comethMarketplaceClient.order.searchOrders({
    tokenIds: [tokenId],
    statuses: [TradeStatus.OPEN],
    direction: TradeDirection.SELL,
  })

  const listings = ordersResponse.orders
  if (!listings?.length)
    throw new Error("Could not find any listing for this asset")

  const order = listings.sort((a, b) => {
    return +a.erc20TokenAmount - +b.erc20TokenAmount
  })[0]

  return order
}
