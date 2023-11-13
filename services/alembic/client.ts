import { NftApi } from "@alembic/nft-api-sdk"
import axios from "axios"

import { env } from "@/config/env"

export const comethMarketplaceClient = new NftApi({
  BASE: env.NEXT_PUBLIC_COMETH_API_URL
})

export const comethAccountClient = axios.create({
  baseURL: "https://account-abstraction.api.alembic.tech/",
  headers: {
    "Content-Type": "application/json",
    Apikey: env.NEXT_PUBLIC_ALEMBIC_API_KEY!,
  },
})