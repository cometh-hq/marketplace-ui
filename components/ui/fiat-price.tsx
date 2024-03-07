import { useEffect, useState } from "react"
import { manifest } from "@/manifests"
import { getFiatCurrencyPrice } from "@/services/coingecko/priceService"

import { cn } from "@/lib/utils/utils"

type FiatPriceProps = {
  amount: string
  className?: string
}

export const FiatPrice = ({ amount, className }: FiatPriceProps) => {
  const [fiatPrice, setFiatPrice] = useState<number | null>(null)

  useEffect(() => {
    const fetchFiatPrice = async () => {
      const amountNumber = parseFloat(amount)

      if (!isNaN(amountNumber) && amountNumber > 0) {
        try {
          const price = await getFiatCurrencyPrice(amountNumber)
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
        {manifest.fiatCurrency?.currencySymbol})
      </span>
    )
  )
}
