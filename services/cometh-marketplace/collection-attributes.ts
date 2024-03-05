import { comethMarketplaceClient } from "./client"

export const fetchCollectionAttributes = async (collectionAddress: string) => {
  return comethMarketplaceClient.collection.getCollectionAttributes(
    collectionAddress
  )
}
