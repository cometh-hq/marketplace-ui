import React, { useCallback, useState } from "react"
import { useDebounceValue } from "usehooks-ts"

import { Input } from "@/components/ui/Input"

import { FiatPrice } from "./FiatPrice"

export interface PriceInputProps {
  id?: string
  onInputUpdate?: (value: string) => void
}

export const PriceInput = ({ id, onInputUpdate }: PriceInputProps) => {
  const [inputValue, setInputValue] = useState<string>("")

  const [debouncedValue] = useDebounceValue(inputValue, 250)

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
      <Input id={id} type="number" inputUpdateCallback={handleChange} min={0} />
      <FiatPrice amount={debouncedValue} />
    </div>
  )
}
