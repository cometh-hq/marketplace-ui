import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { computeHasEnoughGas } from "@/services/balance/gasService"
import { fetchHasApprovedCollection } from "@/services/token-approval/approveCollectionService"
import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"
import { useAccount } from "wagmi"

import { BuyOffer } from "@/types/buy-offers"
import { useStepper } from "@/lib/utils/stepper"

import { useNFTSwapv4 } from "../nft-swap-sdk"
import { useNativeBalance } from "@/services/balance/balanceService"

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
] as AcceptBuyOfferStep[]

export type FetchRequiredSellingStepsOptions = {
  offer: BuyOffer
  address: Address
  nftSwapSdk: NonNullable<ReturnType<typeof useNFTSwapv4>>
  isComethWallet: boolean
  nativeBalance?: bigint
}

export const fetchRequiredAcceptBuyOfferSteps = async ({
  offer,
  address,
  nftSwapSdk,
  isComethWallet,
  nativeBalance,
}: FetchRequiredSellingStepsOptions) => {
  const { hasEnoughGas } = computeHasEnoughGas(address, isComethWallet, nativeBalance)

  const hasApprovedCollection = await fetchHasApprovedCollection({
    address,
    tokenId: offer.asset?.tokenId ?? offer.trade.tokenId,
    nftSwapSdk,
    contractAddress: offer.trade.tokenAddress as Address,
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
  const {balance: nativeBalance} = useNativeBalance(viewerAddress)
  return useQuery({
    queryKey: ["requiredAcceptBuyOfferSteps", offer],
    queryFn: async () => {
      if (!nftSwapSdk || !viewerAddress) return defaultSteps
      return fetchRequiredAcceptBuyOfferSteps({
        offer,
        address: viewerAddress,
        nftSwapSdk,
        isComethWallet,
        nativeBalance
      })
    },
    refetchOnWindowFocus: false,
    enabled: !!nftSwapSdk && !!viewerAddress,
  })
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
