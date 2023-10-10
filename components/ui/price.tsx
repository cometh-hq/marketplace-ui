import { forwardRef } from "react"
import Image from "next/image"
import { VariantProps, cva, cx } from "class-variance-authority"
import { BigNumberish } from "ethers"
import { formatUnits } from "ethers/lib/utils"

import { cn } from "@/lib/utils/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

const priceTriggerVariants = cva("font-bold", {
  variants: {
    variant: {
      default: "",
      destructive: "text-destructive",
      success: "text-success",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
      xl: "text-xl",
      "3xl": "text-3xl font-extrabold",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
})

const iconVariants = cva("object-contain", {
  variants: {
    size: {
      default: "w-6 h-6",
      sm: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-6 h-6",
      "3xl": "w-7 h-7",
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
  className?: string
} & PriceTriggerVariants

const PriceTrigger = forwardRef<HTMLSpanElement, PriceTriggerProps>(
  ({ formattedAmount, size, variant, hideIcon = false, className }, ref) => {
    return (
      <span
        ref={ref}
        className="relative inline-flex items-center align-middle"
      >
        {!hideIcon && (
          <Image
            src="/icons/chains/polygon.svg"
            alt={formattedAmount.toString()}
            width={16}
            height={16}
            className={cn(iconVariants({ size }))}
          />
        )}
        <span className={cn(priceTriggerVariants({ size, variant, className }))}>
          {formattedAmount.toString()}
        </span>
      </span>
    )
  }
)

PriceTrigger.displayName = "PriceTrigger"

export type PriceProps = {
  amount?: BigNumberish | null | undefined
  hideIcon?: boolean
  className?: string
} & PriceTriggerVariants

export const Price = ({ amount, ...rest }: PriceProps) => {
  if (!amount) return "-"

  const formattedAmount = (+formatUnits(amount.toString(), 18)).toString()
  const convertedPrice = 103

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger asChild>
          <PriceTrigger {...rest} formattedAmount={formattedAmount} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm font-bold text-gray-500">
            ≈ {convertedPrice} USD
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
