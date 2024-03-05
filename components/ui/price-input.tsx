import React, { useCallback, useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"

import { Input } from "@/components/ui/input"

import { FiatPrice } from "./fiat-price"

export interface PriceInputProps {
  onInputUpdate?: (value: string) => void
}

export const PriceInput = ({ onInputUpdate }: PriceInputProps) => {
  const [inputValue, setInputValue] = useState<string>("")

  const [debouncedValue] = useDebounceValue(inputValue, 500)

  const handleChange = useCallback(
    (value: string) => {
      if (onInputUpdate) {
        onInputUpdate(value)
        setInputValue(value)
      }
    },
    [onInputUpdate]
  )

  return (
    <div className="space-y-1">
      <Input
        id="make-buy-offer-price"
        type="number"
        onInputUpdate={handleChange}
        min={0}
      />
      <FiatPrice amount={debouncedValue} />
    </div>
  )
}