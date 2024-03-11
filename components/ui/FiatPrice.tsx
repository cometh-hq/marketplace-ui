import { useMemo } from "react"
import { manifest } from "@/manifests/manifests"
import { useConvertPriceToFiat } from "@/services/price/priceService"
import { BigNumber } from "ethers"

import globalConfig from "@/config/globalConfig"
import { balanceToEtherString } from "@/lib/utils/formatBalance"
import { cn } from "@/lib/utils/utils"

type FiatPriceProps = {
  amount: string
  className?: string
}

type BigIntFiatPriceProps = {
  amount: BigInt | BigNumber | string
  className?: string
  isNativeToken?: boolean
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

const useConvertBigIntToString = (
  amount: BigInt | BigNumber | string,
  isNativeToken = globalConfig.useNativeForOrders
) => {
  return useMemo(() => {
    return balanceToEtherString(amount, isNativeToken)
  }, [amount, isNativeToken])
}

export const BigIntFiatPrice = ({
  amount,
  className,
  isNativeToken,
}: BigIntFiatPriceProps) => {
  const stringAmount = useConvertBigIntToString(amount, isNativeToken)

  return <FiatPrice amount={stringAmount} className={className} />
}
