import { wagmiConfig } from "@/providers/wagmi"
import { getBalance, readContract } from "@wagmi/core"
import { Address, erc20Abi } from "viem"

import globalConfig from "@/config/globalConfig"

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
