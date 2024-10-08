import { forwardRef } from "react"
import Image from "next/image"
import { cva, VariantProps } from "class-variance-authority"
import { BigNumberish } from "ethers"
import { formatUnits } from "ethers/lib/utils"

import { env } from "@/config/env"
import globalConfig from "@/config/globalConfig"
import { smartRounding } from "@/lib/utils/priceUtils"
import { cn } from "@/lib/utils/utils"

import { FiatPrice } from "./FiatPrice"

const priceTriggerVariants = cva("inline-flex  items-center", {
  variants: {
    variant: {
      default: "",
      destructive: "text-destructive",
      success: "text-success",
    },
    size: {
      sm: "text-sm",
      default: "text-base",
      lg: "text-lg",
    },
    fontWeight: {
      default: "font-bold",
      normal: "",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
    fontWeight: "default",
  },
})

const iconVariants = cva("rounded-full overflow-hidden object-contain", {
  variants: {
    size: {
      sm: "w-4 h-4",
      default: "w-5 h-5",
      lg: "w-6 h-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export type PriceTriggerVariants = VariantProps<typeof priceTriggerVariants>

export type PriceTriggerProps = {
  formattedAmount: string
  hideIcon?: boolean
  hideSymbol?: boolean
  isNativeToken?: boolean
  shouldDisplayFiatPrice?: boolean
  fiatPriceNewLine?: boolean
  className?: string
} & PriceTriggerVariants

const PriceTrigger = forwardRef<HTMLDivElement, PriceTriggerProps>(
  (
    {
      formattedAmount,
      size,
      variant,
      fontWeight,
      hideIcon = false,
      hideSymbol = true,
      isNativeToken,
      shouldDisplayFiatPrice = false,
      fiatPriceNewLine = false,
      className,
    },
    ref
  ) => {
    const roundedAmount = smartRounding(
      formattedAmount,
      globalConfig.decimals.displayMaxSmallDecimals
    )
    const currency = isNativeToken
      ? globalConfig.network.nativeToken
      : globalConfig.ordersErc20

    return (
      <div
        ref={ref}
        className={cn(
          priceTriggerVariants({ size, variant, className, fontWeight })
        )}

      >
        {!hideIcon && currency.thumb && (
          <div className={cn("relative mr-1", iconVariants({ size }))}>
            <Image
              src={`${env.NEXT_PUBLIC_BASE_PATH}/tokens/${currency.thumb}`}
              alt={currency.symbol}
              fill
            />
          </div>
        )}
        {`${roundedAmount}${
          !hideSymbol || !currency.thumb ? ` ${currency.symbol}` : ""
        }`}
        {fiatPriceNewLine && <br className="hidden sm:inline"></br>}
        {shouldDisplayFiatPrice && (
          <FiatPrice
            className={cn(!fiatPriceNewLine && "ml-1")}
            amount={roundedAmount}
          />
        )}
      </div>
    )
  }
)

PriceTrigger.displayName = "PriceTrigger"

export type PriceProps = {
  amount?: BigNumberish | null | undefined
  hideIcon?: boolean
  hideSymbol?: boolean
  isNativeToken?: boolean
  shouldDisplayFiatPrice?: boolean
  fiatPriceNewLine?: boolean
  className?: string
} & PriceTriggerVariants

export const Price = ({ amount, isNativeToken = globalConfig.useNativeForOrders, ...rest }: PriceProps) => {
  if (!amount) return "-"
  const formattedAmount = formatUnits(
    amount.toString(),
    isNativeToken
      ? globalConfig.decimals.nativeTokenDecimals
      : globalConfig.ordersErc20.decimals
  )

  return (
    <PriceTrigger
      {...rest}
      isNativeToken={isNativeToken}
      formattedAmount={formattedAmount}
    />
  )
}
