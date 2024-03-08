import { useEffect, useMemo } from "react"
import { wagmiConfig } from "@/providers/authentication/marketplaceWagmiProvider"
import { useQueryClient } from "@tanstack/react-query"
import { getBalance, readContract } from "@wagmi/core"
import { Address, erc20Abi } from "viem"
import {
  useAccount,
  useBlockNumber,
  useBalance as useWagmiBalance,
} from "wagmi"

import globalConfig from "@/config/globalConfig"
import { balanceToBigNumber, balanceToString } from "@/lib/utils/formatBalance"

export const getERC20Balance = async (
  erc20Address: Address,
  walletAddress: Address
): Promise<bigint> => {
  const balance = await readContract(wagmiConfig, {
    address: erc20Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [walletAddress],
  })

  return balance
}

export const getOrdersERC20Balance = async (
  walletAddress: Address
): Promise<bigint> => {
  return getERC20Balance(globalConfig.ordersErc20.address, walletAddress)
}

export const getNativeBalance = async (
  walletAddress: Address
): Promise<bigint> => {
  const balance = await getBalance(wagmiConfig, {
    address: walletAddress,
  })

  return balance.value
}

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
  const viewerAddress = useAccount().address
  const native = useNativeBalance(viewerAddress)
  const ERC20 = useERC20Balance(viewerAddress)
  const wrapped = useWrappedBalance(viewerAddress)

  return {
    native: balanceToString(native, true),
    ERC20: balanceToString(ERC20),
    wrapped: balanceToString(wrapped),
  }
}
