import React, { useCallback, useState } from "react"

import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"

interface TokenQuantityInputProps {
  max: bigint
  initialQuantity?: bigint
  label?: string
  onChange: (value: bigint) => void
}

const TokenQuantityInput: React.FC<TokenQuantityInputProps> = ({
  max,
  label,
  onChange,
  initialQuantity,
}) => {
  const [value, setValue] = useState<bigint>(initialQuantity || BigInt(1))

  const handleIncrement = useCallback(() => {
    setValue((prevValue) => {
      const newValue = prevValue + BigInt(1) > max ? max : prevValue + BigInt(1)
      onChange(newValue)
      return newValue
    })
  }, [max, onChange])

  const handleDecrement = useCallback(() => {
    setValue((prevValue) => {
      const newValue =
        prevValue - BigInt(1) < BigInt(1) ? BigInt(1) : prevValue - BigInt(1)
      onChange(newValue)
      return newValue
    })
  }, [onChange])

  const handleChange = useCallback(
    (inputValue: string) => {
      let newValue: bigint
      try {
        newValue = BigInt(inputValue)
      } catch (e) {
        // If conversion to BigInt fails, likely due to an invalid input, do nothing
        return
      }
      if (newValue >= BigInt(0) && newValue <= max) {
        setValue(newValue)
        onChange(newValue)
      }
    },
    [max, onChange]
  )

  return (
    <div className="wrap flex h-full gap-2">
      <div className="grow">
        <Label className="mb-2  md:mb-0" htmlFor="token-quantity-input">
          <div>{label}</div>
          <div className='text-muted-foreground mt-1'>
            Available: {max.toString()}
          </div>
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={handleDecrement} disabled={value <= BigInt(0)}>
          -
        </Button>
        <Input
          type="text" // Changed to text to avoid issues with number input constraints
          id="token-quantity-input"
          value={value.toString()}
          inputUpdateCallback={handleChange}
        />
        <Button onClick={handleIncrement} disabled={value >= max}>
          +
        </Button>
      </div>
    </div>
  )
}

export default TokenQuantityInput
