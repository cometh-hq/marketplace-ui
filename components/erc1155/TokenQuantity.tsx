import React from "react"

interface TokenQuantityProps {
  value: bigint | number  | string
}
const formatValue = (value: bigint | number | string): string => {
  if (BigInt(value) >= BigInt(1000)) {
    return `${(Number(value) / 1000).toFixed(1)} k`
  }
  return value.toString()
}

const TokenQuantity: React.FC<TokenQuantityProps> = ({ value }) => {
  return <span>{formatValue(value)}</span>
}

export default TokenQuantity
