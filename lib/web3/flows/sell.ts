import { fetchHasEnoughGas } from "@/services/balance/has-enough-gas"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

import { useStepper } from "@/lib/utils/stepper"

import { fetchHasApprovedCollection } from "../../../services/token-approval/has-approved-collection"
import { useCurrentViewerAddress, useIsComethWallet } from "../auth"
import { useNFTSwapv4 } from "../nft-swap-sdk"

export type UseRequiredSellingStepsOptions = {
  asset: AssetWithTradeData
}

export type SellingStepValue = "token-approval" | "sell" | "confirmation"

export type SellingStep = {
  label: string
  value: SellingStepValue
}

const defaultSteps = [
  { label: "Pricing", value: "sell" }
] as SellingStep[]

export type FetchRequiredSellingStepsOptions = {
  asset: AssetWithTradeData
  address: Address
  nftSwapSdk: NonNullable<ReturnType<typeof useNFTSwapv4>>
  isComethWallet: boolean
}

export const fetchRequiredSellingSteps = async ({
  asset,
  address,
  nftSwapSdk,
  isComethWallet
}: FetchRequiredSellingStepsOptions) => {
  const { hasEnoughGas } = await fetchHasEnoughGas(address, isComethWallet)

  const hasApprovedCollection = await fetchHasApprovedCollection({
    address,
    tokenId: asset.tokenId,
    nftSwapSdk,
    contractAddress: asset.contractAddress as Address,
  })

  const sellingSteps = [
    !hasEnoughGas && { value: "add-gas", label: "Add gas" },
    !hasApprovedCollection && { value: "token-approval", label: "Permissions" },
    ...defaultSteps,
  ].filter(Boolean) as SellingStep[]

  return sellingSteps
}

export const useRequiredSellingSteps = ({
  asset,
}: UseRequiredSellingStepsOptions) => {
  const viewerAddress = useCurrentViewerAddress()
  const nftSwapSdk = useNFTSwapv4()
  const isComethWallet = useIsComethWallet()

  return useQuery({
    queryKey: ["requiredSellingSteps", asset],
    queryFn: async () => {
      if (!nftSwapSdk || !viewerAddress) return defaultSteps
      return fetchRequiredSellingSteps({
        asset,
        address: viewerAddress,
        nftSwapSdk,
        isComethWallet
      })
    },

    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!nftSwapSdk && !!viewerAddress,
  })
}

export type UseSellAssetButtonOptions = {
  asset: AssetWithTradeData
}

export const useSellAssetButton = ({ asset }: UseSellAssetButtonOptions) => {
  const { data: requiredSteps, isLoading } = useRequiredSellingSteps({ asset })
  const { nextStep, currentStep, reset } = useStepper({ steps: requiredSteps })

  return {
    requiredSteps,
    currentStep,
    isLoading,
    nextStep,
    reset,
  }
}
