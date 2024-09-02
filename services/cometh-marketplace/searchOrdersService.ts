import { SearchOrdersRequest } from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"

import { comethMarketplaceClient } from "@/lib/clients"

export const useSearchOrders = (
  searchRequest: SearchOrdersRequest,
  disabled: boolean = false
) => {
  return useQuery({
    queryKey: [
      "cometh",
      "searchOrders",
      disabled,
      searchRequest.tokenAddress,
      JSON.stringify(searchRequest),
    ],
    queryFn: () => {
      if (disabled) {
        return {
          orders: [],
          total: 0,
        }
      }
      return comethMarketplaceClient.order.searchOrders(searchRequest)
    },
  })
}
