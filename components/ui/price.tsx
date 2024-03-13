import { forwardRef } from "react"
import Image from "next/image"
import { cva, cx, VariantProps } from "class-variance-authority"
import { BigNumberish } from "ethers"
import { formatUnits } from "ethers/lib/utils"

import { env } from "@/config/env"
import globalConfig from "@/config/globalConfig"
import { smartRounding } from "@/lib/utils/priceUtil"
import { cn } from "@/lib/utils/utils"

const priceTriggerVariants = cva("", {
  variants: {
    variant: {
      default: "",
      destructive: "text-destructive",
      success: "text-success",
      accent: "text-accent-foreground",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
    },
    fontWeight: {
      default: "font-bold",
      normal: "font-medium",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
    fontWeight: "default",
  },
})

const iconVariants = cva("object-contain", {
  variants: {
    size: {
      default: "w-5 h-5",
      sm: "w-4 h-4",
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
  className?: string
  isNativeToken?: boolean
} & PriceTriggerVariants

const PriceTrigger = forwardRef<HTMLSpanElement, PriceTriggerProps>(
  (
    {
      formattedAmount,
      size,
      variant,
      fontWeight,
      hideIcon = false,
      hideSymbol = true,
      className,
      isNativeToken,
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
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-x-1.5 align-middle",
          priceTriggerVariants({ size, variant, className, fontWeight })
        )}
      >
        {!hideIcon && currency.thumb && (
          <span className={cn("relative", iconVariants({ size }))}>
            <Image
              src={`${env.NEXT_PUBLIC_BASE_PATH}/tokens/${currency.thumb}`}
              alt={currency.symbol}
              fill
            />
          </span>
        )}
        {`${roundedAmount}${
          !hideSymbol || !currency.thumb ? ` ${currency.symbol}` : ""
        }`}
      </span>
    )
  }
)

PriceTrigger.displayName = "PriceTrigger"

export type PriceProps = {
  amount?: BigNumberish | null | undefined
  hideIcon?: boolean
  hideSymbol?: boolean
  className?: string
  isNativeToken?: boolean
} & PriceTriggerVariants

export const Price = ({ amount, isNativeToken, ...rest }: PriceProps) => {
  if (!amount) return "-"
  const formattedAmount = (+formatUnits(
    amount.toString(),
    isNativeToken
      ? globalConfig.decimals.nativeTokenDecimals
      : globalConfig.ordersErc20.decimals
  )).toString()

  return (
    <PriceTrigger
      {...rest}
      isNativeToken={isNativeToken}
      formattedAmount={formattedAmount}
    />
  )
}
