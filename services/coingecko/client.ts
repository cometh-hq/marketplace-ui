import axios from "axios"
import { setupCache} from "axios-cache-interceptor"

import { env } from "@/config/env"

const axiosInstance = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    "Content-Type": "application/json",
    "x-cg-demo-api-key": env.NEXT_PUBLIC_COINGECKO_API_KEY,
  },
})

// Price updated every 10 minutes
export const coingeckoClient = setupCache(axiosInstance, {
  debug: console.log
})