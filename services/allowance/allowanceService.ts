import { wagmiConfig } from "@/providers/authentication/authenticationUiSwitch"
import { TradeDirection } from "@cometh/marketplace-sdk"
import { useMutation, useQuery } from "@tanstack/react-query"
import { readContract } from "@wagmi/core"
import { BigNumber, BigNumberish } from "ethers"
import { Address, erc20Abi } from "viem"
import { usePublicClient, useWalletClient } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { comethMarketplaceClient } from "@/lib/clients"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"

export type FetchNeedsMoreAllowanceOptions = {
  price: BigNumber
  address: Address
  spender: Address
  contractAddress: Address
}

const fetchSumOfOffers = async (
  userAddress: string,
  erc20Address: string
): Promise<BigNumber> => {
  const ordersResponse = await comethMarketplaceClient.order.searchOrders({
    erc20Token: erc20Address,
    maker: userAddress,
    direction: TradeDirection.BUY,
    limit: 99999,
  })

  let sumOfOffers = BigNumber.from(0)
  ordersResponse.orders.forEach((order) => {
    sumOfOffers = sumOfOffers.add(BigNumber.from(order.totalPrice))
  })

  return sumOfOffers
}

export const fetchNeedsMoreAllowance = async ({
  address,
  spender,
  price,
  contractAddress,
}: FetchNeedsMoreAllowanceOptions): Promise<boolean> => {
  const [allowance, sumOfOffers] = await Promise.all([
    fetchWrappedAllowance({
      address,
      spender,
      contractAddress,
    }),
    fetchSumOfOffers(address, contractAddress),
  ])

  if (!allowance) return true
  return BigNumber.from(allowance).lt(price.add(sumOfOffers))
}

export const getHasEnoughAllowance = async ({
  address,
  spender,
  price,
  contractAddress,
}: FetchNeedsMoreAllowanceOptions): Promise<boolean> => {
  const allowance = fetchWrappedAllowance({
    address,
    spender,
    contractAddress,
  })

  if (!allowance) return false
  return BigNumber.from(allowance).gte(price)
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
    const result = await readContract(wagmiConfig as any, {
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

export const useNeededAllowanceValue = (
  userAddress: string | undefined,
  erc20Address: string,
  newOfferPrice: BigNumberish
) => {
  return useQuery({
    queryKey: ["neededAllowance", userAddress, erc20Address, newOfferPrice],
    queryFn: async (): Promise<BigNumber> => {
      if (userAddress === undefined) return BigNumber.from(newOfferPrice)

      const sumOfOffers = await fetchSumOfOffers(userAddress, erc20Address)
      return sumOfOffers.add(BigNumber.from(newOfferPrice))
    },
  })
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

      const txHash = await viemWalletClient.writeContract({
        address: globalConfig.ordersErc20.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender as Address, BigInt(price.toString())],
      })
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
