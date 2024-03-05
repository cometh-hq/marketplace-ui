import axios from "axios"

import { env } from "@/config/env"

export const coingeckoClient = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    "Content-Type": "application/json",
    "x-cg-demo-api-key": env.COINGECKO_API_KEY,
  },
})