import { MarketplaceSdk } from '@cometh/marketplace-sdk'
import axios from "axios"

import { env } from "@/config/env"

export const comethMarketplaceClient = new MarketplaceSdk({
  BASE: env.NEXT_PUBLIC_COMETH_MARKETPLACE_API_URL,
  HEADERS: {
    apikey: env.NEXT_PUBLIC_MARKETPLACE_API_KEY
  }
})

export const cosmikClient = axios.create({
  baseURL: "https://api.develop.cosmikbattle.com/api",
  withCredentials: true
})