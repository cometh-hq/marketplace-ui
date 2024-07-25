import { useCallback, useEffect } from "react"
import athleteAbi from "@/abis/joca/AthleteAbi"
import rewardPointAbi from "@/abis/joca/RewardPointAbi"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Address, parseEther } from "viem"
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"

import globalConfig from "@/config/globalConfig"
import { comethMarketplaceClient } from "@/lib/clients"

import { useERC20Balance } from "../balance/balanceService"
import { useSearchAssets } from "../cometh-marketplace/searchAssetsService"

export const useAssets = () => {
  const account = useAccount()
  const athleteContractAddress = globalConfig.contractAddresses[0]
  const { data: assetsSearch, isPending: isPendingSearch } = useSearchAssets({
    contractAddress: athleteContractAddress,
    owner: account.address,
  })
  const searchAssets = assetsSearch?.assets
  // const tokenId = searchAthlete?.tokenId
  // const { data: athlete, isPending: isPendingDetails } = useQuery({
  //   queryKey: ["athlete", tokenId],
  //   queryFn: async () => {
  //     if (!tokenId) return null
  //     const athlete = await comethMarketplaceClient.asset.getAsset(
  //       athleteContractAddress,
  //       tokenId
  //     )
  //     return athlete
  //   },
  // })

  return {
    assets: assetsSearch,
    // isPending: isPendingSearch || isPendingDetails,
  }
}


export const useAthlete = () => {
  const account = useAccount()
  const athleteContractAddress = globalConfig.contractAddresses[0]
  const { data: assetsSearch, isPending: isPendingSearch } = useSearchAssets({
    contractAddress: athleteContractAddress,
    owner: account.address,
    limit: 1,
  })
  const searchAthlete = assetsSearch?.assets[0]
  const tokenId = searchAthlete?.tokenId
  const { data: athlete, isPending: isPendingDetails } = useQuery({
    queryKey: ["athlete", tokenId],
    queryFn: async () => {
      if (!tokenId) return null
      const athlete = await comethMarketplaceClient.asset.getAsset(
        athleteContractAddress,
        tokenId
      )
      return athlete
    },
  })

  return {
    athlete: athlete,
    isPending: isPendingSearch || isPendingDetails,
  }
}

export const useMintAthlete = () => {
  const { data: hash, writeContract, error, isPending } = useWriteContract()
  const account = useAccount()
  const client = useQueryClient()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const mintAthlete = useCallback(() => {
    // TODO: This contract call should be done inside an API with a wallet with the minter role
    writeContract({
      address: globalConfig.contractAddresses[0] as Address,
      abi: athleteAbi,
      functionName: "safeMint",
      args: [account.address!],
      account: account.address,
    })
  }, [account.address, writeContract])

  useEffect(() => {
    if (hash && isConfirmed) {
      client.invalidateQueries({ queryKey: ["cometh", "search"] })
      client.invalidateQueries({ queryKey: ["athlete"] })
    }
  }, [isConfirmed, hash, client])

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return {
    mintAthlete,
    isPending: isPending || isConfirming,
  }
}

export const useMintRewardPoints = () => {
  const { data: hash, writeContract, error, isPending } = useWriteContract()
  const account = useAccount()
  const { refreshBalance: refreshErc20Balance } = useERC20Balance(
    globalConfig.ordersErc20.address
  )
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const mintRewardsPoints = useCallback(
    (quantity: string) => {
      // TODO: This contract call should be done inside an API with a wallet with the minter role
      writeContract({
        address: globalConfig.ordersErc20.address as Address,
        abi: rewardPointAbi,
        functionName: "mint",
        args: [account.address!, parseEther(quantity)],
        account: account.address,
      })
    },
    [account.address, writeContract]
  )

  useEffect(() => {
    if (hash && isConfirmed) {
      refreshErc20Balance()
    }
  }, [hash, isConfirmed, refreshErc20Balance])

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return {
    mintRewardsPoints,
    isPending: isPending || isConfirming,
  }
}
