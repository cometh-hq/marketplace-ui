import { manifest } from "@/manifests/manifests"
import axios from "axios"

import globalConfig from "@/config/globalConfig"

const coinId = globalConfig.coinId?.toLowerCase()
const fiatCurrencyId = manifest.fiatCurrency?.currencyId

export const getFiatCurrencyPrice = async (amount: number) => {
  if (!coinId) {
    throw new Error("erc20.id is not defined in the manifest")
  }

  if (!fiatCurrencyId) {
    throw new Error("currencySymbol is not defined in the manifest")
  }

  const res = await axios.get(
    `/api/fiat-currency-price?id=${coinId}&currency=${fiatCurrencyId}`
  )
  const price = res.data.currentFiatPrice[coinId][fiatCurrencyId]
  return Math.round(amount / price)
}
