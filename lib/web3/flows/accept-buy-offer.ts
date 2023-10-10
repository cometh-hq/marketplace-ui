import { AssetWithTradeData } from "@alembic/nft-api-sdk"
import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

import { BuyOffer } from "@/types/buy-offers"
import { useStepper } from "@/lib/utils/stepper"

import { fetchHasApprovedCollection } from "../../../services/token-approval/has-approved-collection"
import { useCurrentViewerAddress } from "../auth"
import { useNFTSwapv4 } from "../nft-swap-sdk"

export type UseRequiredSellingStepsOptions = {
  offer: BuyOffer
}

export type AcceptBuyOfferStepValue =
  | "token-approval"
  | "confirm-accept-buy-offer"
  | "confirmation"

export type AcceptBuyOfferStep = {
  label: string
  value: AcceptBuyOfferStepValue
}

const defaultSteps = [
  { label: "Pricing", value: "confirm-accept-buy-offer" },
  { label: "All set", value: "confirmation" },
] as AcceptBuyOfferStep[]

export type FetchRequiredSellingStepsOptions = {
  offer: BuyOffer
  address: Address
  sdk: NonNullable<ReturnType<typeof useNFTSwapv4>>
}

export const fetchRequiredAcceptBuyOfferSteps = async ({
  offer,
  address,
  sdk,
}: FetchRequiredSellingStepsOptions) => {
  const hasApprovedCollection = await fetchHasApprovedCollection({
    address,
    tokenId: offer.asset?.tokenId ?? offer.trade.tokenId,
    sdk,
    contractAddress: offer.asset?.contractAddress as Address,
  })

  const sellingSteps = [
    !hasApprovedCollection && { value: "token-approval", label: "Permissions" },
    ...defaultSteps,
  ].filter(Boolean) as AcceptBuyOfferStep[]

  return sellingSteps
}

export const useRequiredAcceptBuyOfferSteps = ({
  offer,
}: UseRequiredSellingStepsOptions) => {
  const viewerAddress = useCurrentViewerAddress()
  const sdk = useNFTSwapv4()

  return useQuery(
    ["requiredAcceptBuyOfferSteps", offer],
    async () => {
      if (!sdk || !viewerAddress) return defaultSteps
      return fetchRequiredAcceptBuyOfferSteps({
        offer,
        address: viewerAddress,
        sdk,
      })
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      enabled: !!sdk && !!viewerAddress,
    }
  )
}

export type UseAcceptBuyOfferButtonOptions = {
  offer: BuyOffer
}

export const useAcceptBuyOfferAssetButton = ({
  offer,
}: UseAcceptBuyOfferButtonOptions) => {
  const { data: requiredSteps, isLoading } = useRequiredAcceptBuyOfferSteps({
    offer,
  })
  const { nextStep, currentStep, reset } = useStepper({ steps: requiredSteps })

  return {
    requiredSteps,
    currentStep,
    isLoading,
    nextStep,
    reset,
  }
}
