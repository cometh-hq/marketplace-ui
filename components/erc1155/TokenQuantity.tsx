import React from "react"

interface TokenQuantityProps {
  value: number
}
const formatValue = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} k`
  }
  return value.toString()
}

const TokenQuantity: React.FC<TokenQuantityProps> = ({ value }) => {
  return <span>{formatValue(value)}</span>
}

export default TokenQuantity
