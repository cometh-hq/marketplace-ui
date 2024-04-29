import { SearchFilledEventsRequest } from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"

import { comethMarketplaceClient } from "@/lib/clients"

export const useSearchFilledEvents = (
  searchRequest: SearchFilledEventsRequest,
  disabled: boolean = false
) => {
  return useQuery({
    queryKey: [
      "cometh",
      "searchFilledEvents",
      disabled,
      searchRequest.tokenAddress,
      JSON.stringify(searchRequest),
    ],
    queryFn: () => {
      if (disabled) {
        return {
          filledEvents: [],
          total: 0,
        }
      }
      return comethMarketplaceClient.order.searchOrderFilledEvents(
        searchRequest
      )
    },
  })
}
