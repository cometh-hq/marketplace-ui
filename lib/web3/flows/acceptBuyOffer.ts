import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { fetchHasEnoughGas } from "@/services/balance/gasService"
import { fetchHasApprovedCollection } from "@/services/token-approval/approveCollectionService"
import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"
import { useAccount } from "wagmi"

import { useStepper } from "@/lib/utils/stepper"

import { useNFTSwapv4 } from "../nft-swap-sdk"
import { OrderWithAsset } from "@cometh/marketplace-sdk"

export type UseRequiredSellingStepsOptions = {
  offer: OrderWithAsset
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
] as AcceptBuyOfferStep[]

export type FetchRequiredSellingStepsOptions = {
  offer: OrderWithAsset
  address: Address
  nftSwapSdk: NonNullable<ReturnType<typeof useNFTSwapv4>>
  isComethWallet: boolean
}

export const fetchRequiredAcceptBuyOfferSteps = async ({
  offer,
  address,
  nftSwapSdk,
  isComethWallet,
}: FetchRequiredSellingStepsOptions) => {
  const { hasEnoughGas } = await fetchHasEnoughGas(address, isComethWallet)

  const hasApprovedCollection = await fetchHasApprovedCollection({
    address,
    tokenId: offer.tokenId,
    nftSwapSdk,
    contractAddress: offer.tokenAddress as Address,
    tokenType: offer.tokenType
  })

  const sellingSteps = [
    !hasEnoughGas && { value: "add-gas", label: "Add gas" },
    !hasApprovedCollection && { value: "token-approval", label: "Permissions" },
    ...defaultSteps,
  ].filter(Boolean) as AcceptBuyOfferStep[]

  return sellingSteps
}

export const useRequiredAcceptBuyOfferSteps = ({
  offer,
}: UseRequiredSellingStepsOptions) => {
  const account = useAccount()
  const viewerAddress = account.address
  const nftSwapSdk = useNFTSwapv4()
  const isComethWallet = useIsComethConnectWallet()
  return useQuery({
    queryKey: ["requiredAcceptBuyOfferSteps", offer],
    queryFn: async () => {
      if (!nftSwapSdk || !viewerAddress) return defaultSteps
      return fetchRequiredAcceptBuyOfferSteps({
        offer,
        address: viewerAddress,
        nftSwapSdk,
        isComethWallet,
      })
    },
    refetchOnWindowFocus: false,
    enabled: !!nftSwapSdk && !!viewerAddress,
  })
}

export type UseAcceptBuyOfferButtonOptions = {
  offer: OrderWithAsset
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
