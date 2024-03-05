import { manifest } from "@/manifests"
import axios from "axios"

import globalConfig from "@/config/globalConfig"
import { useEffect, useState } from "react"

const coinId = globalConfig.ordersDisplayCurrency.symbol.toLowerCase()
const fiatCurrency = manifest.fiatCurrency?.symbol

export const getFiatCurrencyPrice = async (amount: number) => {
  if (!fiatCurrency) {
    throw new Error("Fiat currency not found in manifest")
  }

  const res = await axios.get(
    `/api/fiat-currency-price?id=${coinId}&currency=${fiatCurrency}`
  )
  const price = res.data.currentFiatPrice[coinId][fiatCurrency];
  return Math.round(amount / price);
}