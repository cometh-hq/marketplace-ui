import { SearchOrdersRequest } from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"

import { comethMarketplaceClient } from "./client"

export const useSearchOrders = (searchRequest: SearchOrdersRequest) => {
  return useQuery({
    queryKey: [
      "cometh",
      "searchOrders",
      searchRequest.tokenAddress,
      JSON.stringify(searchRequest),
    ],
    queryFn: () => {
      return comethMarketplaceClient.order.searchOrders(searchRequest)
    },
  })
}
