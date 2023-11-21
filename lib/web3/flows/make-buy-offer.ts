import { useState } from "react"
import { manifest } from "@/manifests"
import { fetchNeedsToWrap } from "@/services/exchange/needs-to-wrap"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"

import { useStepper } from "@/lib/utils/stepper"

import { fetchNeedsMoreAllowance } from "../../../services/allowance/needs-more-allowance"
import { fetchHasSufficientFunds } from "../../../services/balance/has-sufficient-funds"
import { useCurrentViewerAddress } from "../auth"
import { useNFTSwapv4 } from "../nft-swap-sdk"

export type UseRequiredMakeBuyOfferSteps = {
  asset: AssetWithTradeData
  price?: BigNumber | null
  validity?: string | null
}

export type MakeBuyOfferStepValue =
  | "add-funds"
  | "wrap"
  | "allowance"
  | "confirm-buy-offer"
  | "confirmation"

export type MakeBuyOfferStep = {
  label: string
  value: MakeBuyOfferStepValue
}

const suffixSteps: MakeBuyOfferStep[] = [
  { label: "Confirm", value: "confirm-buy-offer" },
  { label: "All set", value: "confirmation" },
]

export type FetchRequiredBuyingStepsOptions = {
  price: BigNumber
  address: Address
  wrappedContractAddress: Address
  spender: Address
}

export const fetchRequiredMakeBuyOfferSteps = async ({
  price,
  address,
  wrappedContractAddress,
  spender,
}: FetchRequiredBuyingStepsOptions) => {
  const displayAddFundsStep = price
    ? !(
        await fetchHasSufficientFunds({
          address,
          price,
          wrappedContractAddress,
        })
      )?.hasSufficientFunds
    : false

  const displaysAllowanceStep = price
    ? await fetchNeedsMoreAllowance({
        address,
        price,
        contractAddress: wrappedContractAddress,
        spender,
      })
    : false

  const displayWrapStep = await fetchNeedsToWrap({
    price,
    address,
    wrappedContractAddress,
  })

  const makeBuyOfferSteps = [
    displayAddFundsStep && { value: "add-funds", label: "Add funds" },
    displayWrapStep && { value: "wrap", label: "Wrap" },
    displaysAllowanceStep && { value: "allowance", label: "Allowance" },
    ...suffixSteps,
  ].filter(Boolean) as MakeBuyOfferStep[]

  return makeBuyOfferSteps
}

export const useRequiredMakeBuyOfferSteps = ({
  asset,
  price,
}: UseRequiredMakeBuyOfferSteps) => {
  const viewerAddress = useCurrentViewerAddress()
  const nftSwapSdk = useNFTSwapv4()

  return useQuery(
    ["requiredBuyingSteps", asset, price],
    async () => {
      if (!viewerAddress) return suffixSteps
      return fetchRequiredMakeBuyOfferSteps({
        price: price!,
        address: viewerAddress,
        wrappedContractAddress: manifest.currency.wrapped.address,
        spender: nftSwapSdk?.exchangeProxyContractAddress! as Address,
      })
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!viewerAddress && !!price,
    }
  )
}

export type UseMakeBuyOfferAssetButtonOptions = {
  asset: AssetWithTradeData
}

export const useMakeBuyOfferAssetButton = ({
  asset,
}: UseMakeBuyOfferAssetButtonOptions) => {
  const [price, setPrice] = useState<BigNumber | null>(null)
  const [validity, setValidity] = useState<string | null>(null)

  const {
    data: requiredSteps,
    isLoading,
    refetch,
  } = useRequiredMakeBuyOfferSteps({
    asset,
    price,
    validity,
  })
  const { nextStep, currentStep, reset } = useStepper({ steps: requiredSteps })

  return {
    isLoading,
    requiredSteps,
    currentStep,
    nextStep,
    reset,
    price,
    setPrice,
    validity,
    setValidity,
    refetch,
  }
}
