import { comethMarketplaceClient } from "../clients"
import globalConfig from "@/config/globalConfig"

export const fetchCollectionAttributes = async () => {
  return comethMarketplaceClient.collection.getCollectionAttributes(
    globalConfig.contractAddress
  )
}
