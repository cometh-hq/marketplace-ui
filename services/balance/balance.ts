import { useEffect, useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Address } from "viem"
import {
  useAccount,
  useBlockNumber,
  useBalance as useWagmiBalance,
} from "wagmi"

import globalConfig from "@/config/globalConfig"

import { balanceToBigNumber, balanceToString } from "./format"

export const useNativeBalance = (address?: Address) => {
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const { data: balance, queryKey } = useWagmiBalance({
    chainId: globalConfig.network.chainId,
    address,
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey })
  }, [blockNumber, queryClient, queryKey])

  return useMemo(() => balanceToBigNumber(balance?.value), [balance])
}

export const useERC20Balance = (address?: Address) => {
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const { data: balance, queryKey } = useWagmiBalance({
    chainId: globalConfig.network.chainId,
    address,
    token: globalConfig.ordersErc20.address,
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey })
  }, [blockNumber, queryClient, queryKey])

  return useMemo(() => balanceToBigNumber(balance?.value), [balance])
}

export const useWrappedBalance = (address?: Address) => {
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const { data: balance, queryKey } = useWagmiBalance({
    chainId: globalConfig.network.chainId,
    address,
    token: globalConfig.network.wrappedNativeToken.address,
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey })
  }, [blockNumber, queryClient, queryKey])

  return useMemo(() => balanceToBigNumber(balance?.value), [balance])
}

export const useBalance = () => {
  const account = useAccount()
  const viewerAddress = account.address
  const native = useNativeBalance(viewerAddress)
  const ERC20 = useERC20Balance(viewerAddress)
  const wrapped = useWrappedBalance(viewerAddress)

  return useMemo(() => {
    return {
      native: balanceToString(native, true),
      ERC20: balanceToString(ERC20),
      wrapped: balanceToString(wrapped),
    }
  }, [native, ERC20, wrapped])
}
