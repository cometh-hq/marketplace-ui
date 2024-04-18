import React, { useMemo } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"

interface TokenQuantityProps {
  value: bigint | number | string
}
const formatValue = (value: bigint | number | string): string => {
  if (BigInt(value) >= BigInt(1000)) {
    return `${(Number(value) / 1000).toFixed(1)} k`
  }
  return BigInt(value).toLocaleString()
}

const TokenQuantity: React.FC<TokenQuantityProps> = ({ value }) => {
  const formatedValue = useMemo(() => {
    return formatValue(value)
  }, [value])

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger asChild>
          <span>{formatedValue}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm font-bold">{BigInt(value).toLocaleString()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TokenQuantity
