import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@alembic/nft-api-sdk"
import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

import { useStepper } from "@/lib/utils/stepper"

import { fetchHasApprovedCollection } from "../../../services/token-approval/has-approved-collection"
import { useCurrentViewerAddress } from "../auth"
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
  { label: "Pricing", value: "sell" },
  { label: "All set", value: "confirmation" },
] as SellingStep[]

export type FetchRequiredSellingStepsOptions = {
  asset: AssetWithTradeData
  address: Address
  nftSwapSdk: NonNullable<ReturnType<typeof useNFTSwapv4>>
}

export const fetchRequiredSellingSteps = async ({
  asset,
  address,
  nftSwapSdk,
}: FetchRequiredSellingStepsOptions) => {
  const hasApprovedCollection = await fetchHasApprovedCollection({
    address,
    tokenId: asset.tokenId,
    nftSwapSdk,
    contractAddress: asset.contractAddress as Address,
  })

  const sellingSteps = [
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

  return useQuery(
    ["requiredSellingSteps", asset],
    async () => {
      if (!nftSwapSdk || !viewerAddress) return defaultSteps
      return fetchRequiredSellingSteps({
        asset,
        address: viewerAddress,
        nftSwapSdk,
      })
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      enabled: !!nftSwapSdk && !!viewerAddress,
    }
  )
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
