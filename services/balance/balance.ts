import { useEffect, useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Address } from "viem"
import { useBlockNumber, useBalance as useWagmiBalance } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { useCurrentViewerAddress } from "@/lib/web3/auth"

import { balanceToBigNumber, balanceToString } from "./format"

export const useNativeBalance = (address: Address) => {
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

export const useERC20Balance = (address: Address) => {
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

export const useWrappedBalance = (address: Address) => {
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
  const address = useCurrentViewerAddress() as `0x${string}`

  const native = useNativeBalance(address)
  const ERC20 = useERC20Balance(address)
  const wrapped = useWrappedBalance(address)

  return {
    native: useMemo(() => balanceToString(native, true), [native]),
    ERC20: useMemo(() => balanceToString(ERC20), [ERC20]),
    wrapped: useMemo(() => balanceToString(wrapped), [wrapped]),
  }
}
