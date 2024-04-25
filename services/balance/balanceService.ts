import { useEffect, useMemo } from "react"
import { wagmiConfig } from "@/providers/authentication/authenticationUiSwitch"
import { useQueryClient } from "@tanstack/react-query"
import { getBalance, readContract } from "@wagmi/core"
import { Address, erc20Abi } from "viem"
import {
  useAccount,
  useBlockNumber,
  useBalance as useWagmiBalance,
} from "wagmi"

import globalConfig from "@/config/globalConfig"
import {
  balanceToBigNumber,
  balanceToEtherString,
} from "@/lib/utils/formatBalance"
import { smartRounding } from "@/lib/utils/priceUtils"

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

export const useAllBalances = () => {
  const viewerAddress = useAccount().address
  const native = useNativeBalance(viewerAddress)
  const ERC20 = useERC20Balance(viewerAddress)
  const wrapped = useWrappedBalance(viewerAddress)

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
