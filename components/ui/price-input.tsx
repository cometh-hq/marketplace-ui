import React, { useEffect, useState } from "react"
import { manifest } from "@/manifests"
import { getFiatCurrencyPrice } from "@/services/coingecko/fiat-currency-price"
import { useDebounceValue } from "usehooks-ts"

import { Input } from "@/components/ui/input"

import { Label } from "./label"
import { FiatPrice } from "./fiat-price"

export interface PriceInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  onInputUpdate?: (value: string) => void
}

const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
  ({ className, type, icon, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<string>("")

    const [debouncedValue] = useDebounceValue(inputValue, 500)

    const handleChange = (value: string) => {
      setInputValue(value)
      if (props.onInputUpdate) {
        props.onInputUpdate(value)
      }
    }

    return (
      <div>
        <Input
          id="make-buy-offer-price"
          type="number"
          onInputUpdate={handleChange}
          min={0}
        />
        <FiatPrice amount={parseFloat(debouncedValue)} />
      </div>
    )
  }
)

PriceInput.displayName = "PriceInput"

export default PriceInput
