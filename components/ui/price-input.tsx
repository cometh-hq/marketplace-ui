import React, { useEffect, useState } from "react"
import { manifest } from "@/manifests"
import { getFiatCurrencyPrice } from "@/services/coingecko/fiat-currency-price"
import { useDebounceValue } from "usehooks-ts"

import { Input } from "@/components/ui/input"

import { Label } from "./label"

export interface PriceInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  onInputUpdate?: (value: string) => void
}

const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
  ({ className, type, icon, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<string>("")
    const [fiatPrice, setFiatPrice] = useState<number | null>(null)

    const [debouncedValue] = useDebounceValue(inputValue, 500)

    useEffect(() => {
      const fetchFiatPrice = async () => {
        if (debouncedValue) {
          const value = parseFloat(debouncedValue)
          if (!isNaN(value)) {
            const price = await getFiatCurrencyPrice(value)
            setFiatPrice(price)
          } else {
            setFiatPrice(null)
          }
        } else {
          setFiatPrice(null)
        }
      }

      fetchFiatPrice()
    }, [debouncedValue])

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
        {fiatPrice && (
          <div className="mt-2 text-end text-xs font-medium leading-none text-muted-foreground">
            ≈ {fiatPrice}{manifest.fiatCurrency?.format}
          </div>
        )}
      </div>
    )
  }
)

PriceInput.displayName = "PriceInput"

export default PriceInput
