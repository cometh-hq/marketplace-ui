import { manifest } from "@/manifests"

import { comethMarketplaceClient } from "./client"

export const fetchCollectionAttributes = async () => {
  return comethMarketplaceClient.collection.getCollectionAttributes(
    manifest.contractAddress
  )
}
