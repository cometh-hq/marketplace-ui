import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

import { comethMarketplaceClient } from "./client"
import globalConfig from "@/config/globalConfig"

export const fetchGetCollection = async (contractAddress: Address) => {
  return comethMarketplaceClient.collection.getCollection(
    contractAddress.toLocaleLowerCase()
  )
}

export const useGetCollection = () => {
  const contractAddress = globalConfig.contractAddress

  return useQuery(["cometh", "collection", contractAddress], () => {
    return fetchGetCollection(contractAddress)
  })
}
