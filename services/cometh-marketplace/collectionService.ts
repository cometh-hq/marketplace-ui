import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

import { comethMarketplaceClient } from "@/lib/clients"

export const fetchGetCollection = async (contractAddress: Address) => {
  return comethMarketplaceClient.collection.getCollection(
    contractAddress.toLocaleLowerCase()
  )
}

export const useGetCollection = (collectionAddress: Address) => {
  return useQuery({
    queryKey: ["cometh", "collection", collectionAddress],
    queryFn: () => {
      return fetchGetCollection(collectionAddress)
    },
    staleTime: 1000 * 15,
  })
}
