"use client"

import { useCallback, useEffect, useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Address, erc20Abi } from "viem"
import {
  useAccount,
  useBlockNumber,
  useReadContract,
  useBalance as useWagmiBalance,
} from "wagmi"

import globalConfig from "@/config/globalConfig"
import {
  balanceToBigNumber,
  balanceToEtherString,
} from "@/lib/utils/formatBalance"
import { smartRounding } from "@/lib/utils/priceUtils"

const BALANCE_REFRESH_BLOCK_INTERVAL = 10
const LATEST_BLOCK_CACHE_MS = 2_000

export const useNativeBalance = (address?: Address) => {
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    cacheTime: LATEST_BLOCK_CACHE_MS,
  })
  const userAddresse = useAccount().address
  const addressToUse = address || userAddresse
  const {
    data: balance,
    queryKey,
    isPending,
  } = useWagmiBalance({
    chainId: globalConfig.network.chainId,
    address: addressToUse,
    query: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  })

  const blockNumberRefreshTick = blockNumber
    ? blockNumber / BigInt(BALANCE_REFRESH_BLOCK_INTERVAL)
    : blockNumber

  const stringQueryKey = useMemo(() => JSON.stringify(queryKey), [queryKey])

  const refreshBalance = useCallback(
    () => queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false }),
    [queryClient]
  )
  useEffect(() => {
    refreshBalance()
  }, [blockNumberRefreshTick, refreshBalance, stringQueryKey])

  return useMemo(() => {
    return {
      bigNumberBalance: balanceToBigNumber(balance?.value),
      balance: balance?.value,
      refreshBalance: refreshBalance,
      isPending,
    }
  }, [balance, refreshBalance, isPending])
}

export const useERC20Balance = (
  erc20Address?: Address,
  userAddress?: Address
) => {
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    cacheTime: LATEST_BLOCK_CACHE_MS,
  })
  const account = useAccount()
  const userAddressToUse = userAddress || account.address
  const {
    data: balance,
    queryKey,
    isPending,
  } = useReadContract({
    address: erc20Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [userAddressToUse!],
    query: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  })
  const blockNumberRefreshTick = blockNumber
    ? blockNumber / BigInt(BALANCE_REFRESH_BLOCK_INTERVAL)
    : blockNumber

  const stringQueryKey = useMemo(() => JSON.stringify(queryKey), [queryKey])

  const refreshBalance = useCallback(
    () => queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false }),
    [queryClient]
  )

  useEffect(() => {
    refreshBalance()
  }, [blockNumberRefreshTick, refreshBalance, stringQueryKey])

  return useMemo(() => {
    return {
      bigNumberBalance: balanceToBigNumber(balance),
      balance: balance,
      refreshBalance: refreshBalance,
      isPending,
    }
  }, [balance, refreshBalance, isPending])
}

export const useAllBalances = () => {
  const viewerAddress = useAccount().address
  const { bigNumberBalance: native } = useNativeBalance(viewerAddress)
  const { bigNumberBalance: ERC20 } = useERC20Balance(
    globalConfig.ordersErc20.address
  )
  const { bigNumberBalance: wrapped } = useERC20Balance(
    globalConfig.network.wrappedNativeToken.address
  )

  return {
    native: smartRounding(
      balanceToEtherString(native, true),
      globalConfig.decimals.displayMaxSmallDecimals
    ),
    ERC20: smartRounding(
      balanceToEtherString(ERC20),
      globalConfig.decimals.displayMaxSmallDecimals
    ),
    wrapped: smartRounding(
      balanceToEtherString(wrapped),
      globalConfig.decimals.displayMaxSmallDecimals
    ),
  }
}
