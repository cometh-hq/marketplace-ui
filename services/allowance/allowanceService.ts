import { wagmiConfig } from "@/providers/authentication/authenticationUiSwitch"
import { useMutation } from "@tanstack/react-query"
import { readContract } from "@wagmi/core"
import { BigNumber, BigNumberish } from "ethers"
import { Address, erc20Abi } from "viem"
import { usePublicClient, useWalletClient } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"

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
    contractAddress,
  })

  if (!allowance) return true
  return BigNumber.from(allowance).lt(price)
}

export const fetchWrappedAllowance = async ({
  address,
  spender,
  contractAddress,
}: {
  address: Address
  spender: Address
  contractAddress: Address
}) => {
  try {
    const result = await readContract(wagmiConfig, {
      address: contractAddress,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address, spender],
    })
    return result
  } catch (error) {
    console.error("Error reading contract:", error)
    return null
  }
}

export type UseAllowanceParameters = {
  address: Address
  spender: Address
}

export type WrappedTokenAllowParams = {
  amount: BigNumberish
}

export const useERC20Allow = (
  price: BigNumberish,
  options?: {
    onSuccess?: () => void
  }
) => {
  const nftSwapSdk = useNFTSwapv4()
  const viemPublicClient = usePublicClient()
  const { data: viemWalletClient } = useWalletClient()

  return useMutation({
    mutationKey: ["wrappedTokenAllow"],
    mutationFn: async () => {
      if (!nftSwapSdk || !viemWalletClient || !viemPublicClient) return
      const spender = nftSwapSdk?.exchangeProxyContractAddress!
      const { request } = await viemPublicClient.simulateContract({
        address: globalConfig.ordersErc20.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender as Address, BigInt(price.toString())],
        account: viemWalletClient.account,
      })
      const txHash = await viemWalletClient.writeContract(request)
      const transaction = await viemPublicClient.waitForTransactionReceipt({
        hash: txHash,
      })

      return transaction
    },
    ...options,
    onSuccess: () => {
      options?.onSuccess?.()
    },
  })
}
