import { useState } from "react"
import { manifest } from "@/manifests"
import { AssetWithTradeData } from '@cometh/marketplace-sdk'
import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"

import { useStepper } from "@/lib/utils/stepper"

import { fetchHasApprovedCollection } from "../../../services/token-approval/has-approved-collection"
import { useCurrentViewerAddress } from "../auth"
import { useNFTSwapv4 } from "../nft-swap-sdk"

export type UseRequiredAuctionStepsOptions = {
  asset: AssetWithTradeData
}

export type AuctionStepValue = "token-approval" | "auction" | "confirmation"

export type SellingStep = {
  label: string
  value: AuctionStepValue
}

const defaultSteps: SellingStep[] = [
  { label: "Pricing", value: "auction" },
  { label: "All set", value: "confirmation" },
]

export type FetchRequiredAuctionStepsOptions = {
  asset: AssetWithTradeData
  address: Address
  sdk: NonNullable<ReturnType<typeof useNFTSwapv4>>
  contractAddress: Address
}

export const fetchRequiredAuctionSteps = async ({
  asset,
  address,
  sdk,
  contractAddress,
}: FetchRequiredAuctionStepsOptions) => {
  const needsERC721Approval = !(await fetchHasApprovedCollection({
    address,
    tokenId: asset.tokenId,
    sdk,
    contractAddress,
  }))

  const sellingSteps = [
    needsERC721Approval && { value: "token-approval", label: "Permissions" },
    ...defaultSteps,
  ].filter(Boolean) as SellingStep[]

  return sellingSteps
}

export const useRequiredSellingSteps = ({
  asset,
}: UseRequiredAuctionStepsOptions) => {
  const viewerAddress = useCurrentViewerAddress()
  const sdk = useNFTSwapv4()

  return useQuery(
    ["requiredAuctionSteps", asset],
    async () => {
      if (!viewerAddress || !sdk) return defaultSteps
      return fetchRequiredAuctionSteps({
        asset,
        address: viewerAddress,
        sdk,
        contractAddress: manifest.contractAddress,
      })
    },
    {
      staleTime: Infinity,
      enabled: !!viewerAddress && !!sdk,
      refetchOnWindowFocus: false,
    }
  )
}

export type UseAuctionAssetButtonOptions = {
  asset: AssetWithTradeData
}

export const useAuctionAssetButton = ({
  asset,
}: UseAuctionAssetButtonOptions) => {
  const [price, setPrice] = useState<BigNumber | null>(null)
  const { data: requiredSteps, isLoading } = useRequiredSellingSteps({ asset })
  const { nextStep, currentStep, reset } = useStepper({ steps: requiredSteps })

  return {
    requiredSteps,
    currentStep,
    isLoading,
    nextStep,
    reset,
    price,
    setPrice,
  }
}
