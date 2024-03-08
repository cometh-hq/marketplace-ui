import { useMemo } from "react"
import { manifest } from "@/manifests"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import globalConfig from "@/config/globalConfig"

const coinId = globalConfig.coinId?.toLowerCase()
const fiatCurrencyId = manifest.fiatCurrency?.currencyId

const useTokenFiatPrice = () => {
  return useQuery({
    queryKey: ["fiat-price"],
    queryFn: async () => {
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
      return price as number
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  })
}

export const useConvertPriceToFiat = (amount?: number | null) => {
  const { data: price } = useTokenFiatPrice()

  return useMemo(() => {
    if (!manifest.fiatCurrency.enable) {
      return null
    }
    if (!amount || isNaN(amount) || !price || price === 0) {
      return null
    }
    const fiatPrice = amount / price
    return Math.round(fiatPrice * 100) / 100
  }, [amount, price])
}
