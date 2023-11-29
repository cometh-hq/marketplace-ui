import { BigNumber } from "ethers"
import { Address } from "viem"

import { fetchWrappedAllowance } from "./wrapped-token-allowance"

export type FetchNeedsMoreAllowanceOptions = {
  price: BigNumber
  address: Address
  spender: Address
  contractAddress: Address
}

export const fetchNeedsMoreAllowance = async ({
  address,
  spender,
  price,
  contractAddress,
}: FetchNeedsMoreAllowanceOptions): Promise<boolean> => {
  const allowance = await fetchWrappedAllowance({
    address,
    spender,
    contractAddress: contractAddress,
  })
  if (!allowance) return true
  return BigNumber.from(allowance).lt(price)
}