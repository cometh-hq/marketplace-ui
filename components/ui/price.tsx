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
    },
    size: {
      default: "text-base",
      sm: "text-sm",
    },
    fontWeight: {
      default: "font-bold",
      normal: ""
    }
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
    },
    ref
  ) => {
    const roundedAmount = smartRounding(
      formattedAmount,
      globalConfig.decimals.displayMaxSmallDecimals
    )
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-x-1.5 align-middle",
          priceTriggerVariants({ size, variant, className, fontWeight })
        )}
      >
        {!hideIcon && globalConfig.ordersDisplayCurrency.thumb && (
          <span className={cn("relative", iconVariants({ size }))}>
            <Image
              src={`${env.NEXT_PUBLIC_BASE_PATH}/tokens/${globalConfig.ordersDisplayCurrency.thumb}`}
              alt={globalConfig.ordersDisplayCurrency.symbol}
              fill
            />
          </span>
        )}
        {`${roundedAmount}${
          !hideSymbol || !globalConfig.ordersDisplayCurrency.thumb
            ? ` ${globalConfig.ordersDisplayCurrency.symbol}`
            : ""
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
} & PriceTriggerVariants

export const Price = ({ amount, ...rest }: PriceProps) => {
  if (!amount) return "-"
  const formattedAmount = (+formatUnits(amount.toString(), 18)).toString()

  return <PriceTrigger {...rest} formattedAmount={formattedAmount} />
}
