import { manifest } from "@/manifests/manifests"
import { useConvertPriceToFiat } from "@/services/price/priceService"
import { BigNumber } from "ethers"

import { cn } from "@/lib/utils/utils"

type FiatPriceProps = {
  amount: string
  className?: string
}

export const FiatPrice = ({ amount, className }: FiatPriceProps) => {
  const fiatPrice = useConvertPriceToFiat(parseFloat(amount))

  return (
    fiatPrice !== null && (
      <span
        className={cn("text-foreground/60 text-sm font-semibold", className)}
      >
        (≈ {fiatPrice}
        {manifest.fiatCurrency?.currencySymbol})
      </span>
    )
  )
}

