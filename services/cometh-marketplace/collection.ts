import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { comethMarketplaceClient } from "./client"

export const fetchGetCollection = async (contractAddress: Address) => {
  return comethMarketplaceClient.collection.getCollection(
    contractAddress.toLocaleLowerCase()
  )
}

export const useGetCollection = () => {
  const contractAddress = globalConfig.contractAddress

  return useQuery({
    queryKey: ["cometh", "collection", contractAddress],
    queryFn: () => {
      return fetchGetCollection(contractAddress)
    },
  })
}
