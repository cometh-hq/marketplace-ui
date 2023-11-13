import { manifest } from "@/manifests"
import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

import { comethMarketplaceClient } from "./client"

export const fetchGetCollection = async (contractAddress: Address) => {
  return comethMarketplaceClient.collection.getCollection(
    contractAddress.toLocaleLowerCase()
  )
}

export const useGetCollection = () => {
  const contractAddress = manifest.contractAddress

  return useQuery(["alembic", "collection", contractAddress], () => {
    return fetchGetCollection(contractAddress)
  })
}
