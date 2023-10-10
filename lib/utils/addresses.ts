import { Address } from "viem"

export const shortenAddress = (address?: Address | null, chars = 4): string => {
  address ??= "0x"
  return `${address.slice(0, chars + 2)}...${address.slice(
    address.length - chars
  )}`
}
