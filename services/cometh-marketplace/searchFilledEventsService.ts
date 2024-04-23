import { SearchFilledEventsRequest } from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"

import { comethMarketplaceClient } from "@/lib/clients"

export const useSearchFilledEvents = (searchRequest: SearchFilledEventsRequest) => {
  return useQuery({
    queryKey: [
      "cometh",
      "searchFilledEvents",
      searchRequest.tokenAddress,
      JSON.stringify(searchRequest),
    ],
    queryFn: () => {
      return comethMarketplaceClient.order.searchOrderFilledEvents(searchRequest)
    },
  })
}
