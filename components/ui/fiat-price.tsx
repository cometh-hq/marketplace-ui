import { useEffect, useState } from "react"
import { manifest } from "@/manifests"
import { getFiatCurrencyPrice } from "@/services/coingecko/fiat-currency-price"

import { cn } from "@/lib/utils/utils"

type FiatPriceProps = {
  amount: number
  className?: string
}

export const FiatPrice = ({ amount, className }: FiatPriceProps) => {
  const [fiatPrice, setFiatPrice] = useState<number | null>(null)

  useEffect(() => {
    const fetchFiatPrice = async () => {
      if (!isNaN(amount) && amount > 0) {
        try {
          const price = await getFiatCurrencyPrice(amount)
          setFiatPrice(price)
        } catch (error) {
          console.error("Failed to fetch fiat price", error)
          setFiatPrice(null)
        }
      } else {
        setFiatPrice(null)
      }
    }

    fetchFiatPrice()
  }, [amount])

  return (
    fiatPrice !== null && (
      <span
        className={cn("text-sm font-semibold text-foreground/60", className)}
      >
        (≈ {fiatPrice}
        {manifest.fiatCurrency?.format})
      </span>
    )
  )
}
