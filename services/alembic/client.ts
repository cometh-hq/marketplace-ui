import { NftApi } from "@alembic/nft-api-sdk"

import { env } from "@/config/env"

export const comethMarketplaceClient = new NftApi({
  BASE: env.NEXT_PUBLIC_COMETH_API_URL
})