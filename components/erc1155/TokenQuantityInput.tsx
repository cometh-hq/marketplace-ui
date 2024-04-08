import React, { useCallback, useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"

interface QuantityInputProps {
  max: number
  label?: string
  onChange: (value: number) => void
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  max,
  label,
  onChange,
}) => {
  const [value, setValue] = useState(0)

  const handleIncrement = useCallback(() => {
    setValue((prevValue) => {
      const newValue = Math.min(prevValue + 1, max)
      onChange(newValue)
      return newValue
    })
  }, [max, onChange])

  const handleDecrement = useCallback(() => {
    setValue((prevValue) => {
      const newValue = Math.max(prevValue - 1, 0)
      onChange(newValue)
      return newValue
    })
  }, [onChange])

  const handleChange = useCallback(
    (inputValue : string) => {
      const newValue = parseInt(inputValue, 10)
      if (!isNaN(newValue) && newValue >= 0 && newValue <= max) {
        setValue(newValue)
        onChange(newValue)
      }
    },
    [max, onChange]
  )

  return (
    <div className="flex flex-col items-center justify-between space-x-2 md:flex-row">
      <label className="mb-2 md:mb-0">
        {label ? `${label} (Max: ${max})` : `Max: ${max}`}
      </label>
      <div className="flex items-center space-x-2">
        <Button
          
          onClick={handleDecrement}
          disabled={value <= 0}
        >
          -
        </Button>
        <Input
          type="number"
          value={value}
          inputUpdateCallback={handleChange}
          min="0"
          max={max.toString()}
        />
        <Button
          
          onClick={handleIncrement}
          disabled={value >= max}
        >
          +
        </Button>
      </div>
    </div>
  )
}

export default QuantityInput
