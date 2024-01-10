import { manifest } from "@/manifests"
import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { fetchMainBalance } from "./main"
import { fetchWrappedBalance } from "./wrapped"

export type FetchHasSufficientFundsOptions = {
  address: Address
  price?: BigNumber | null
  wrappedContractAddress: Address
}

export type UseHasSufficientFundsOptions = {
  address?: Address | null
  price?: BigNumber | null
}

export const fetchHasSufficientFunds = async ({
  address,
  price,
  wrappedContractAddress,
}: FetchHasSufficientFundsOptions) => {
  const [mainBalance, wrappedBalance] = await Promise.all([
    fetchMainBalance(address),
    fetchWrappedBalance(address, wrappedContractAddress),
  ])

  const hasSufficientFunds = mainBalance.add(wrappedBalance).gte(price ?? 0)

  const missingBalance = hasSufficientFunds
    ? BigNumber.from(0)
    : price?.sub(mainBalance.add(wrappedBalance))

  return {
    hasSufficientFunds,
    missingBalance,
  }
}

export const useHasSufficientFunds = ({
  address,
  price,
}: UseHasSufficientFundsOptions) => {
  return useQuery(
    ["hasSufficientFunds", address, price],
    async () =>
      fetchHasSufficientFunds({
        address: address!,
        price,
        wrappedContractAddress: globalConfig.network.wrappedNativeToken.address,
      }),
    {
      enabled: !!address && !!price,
    }
  )
}
