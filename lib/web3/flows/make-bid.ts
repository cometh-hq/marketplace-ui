import { useState } from "react"
import { manifest } from "@/manifests"
import { fetchNeedsToWrap } from "@/services/exchange/needs-to-wrap"
import { AssetWithTradeData } from "@alembic/nft-api-sdk"
import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"

import { useStepper } from "@/lib/utils/stepper"

import { fetchNeedsMoreAllowance } from "../../../services/allowance/needs-more-allowance"
import { fetchHasSufficientFunds } from "../../../services/balance/has-sufficient-funds"
import { useCurrentViewerAddress } from "../auth"
import { useNFTSwapv4 } from "../nft-swap-sdk"

export type UseRequiredMakeBidSteps = {
  asset: AssetWithTradeData
  price?: BigNumber | null
}

export type MakeBidStepValue =
  | "add-funds"
  | "wrap"
  | "allowance"
  | "confirm-bid"
  | "confirmation"

export type MakeBidStep = {
  label: string
  value: MakeBidStepValue
}

const suffixSteps: MakeBidStep[] = [
  { label: "Confirm", value: "confirm-bid" },
  { label: "All set", value: "confirmation" },
]

export type FetchRequiredMakeBidStepsOptions = {
  price: BigNumber
  address: Address
  wrappedContractAddress: Address
  spender: Address
}

export const fetchRequiredMakeBidSteps = async ({
  price,
  address,
  wrappedContractAddress,
  spender,
}: FetchRequiredMakeBidStepsOptions) => {
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
  ].filter(Boolean) as MakeBidStep[]

  return makeBuyOfferSteps
}

export const useRequiredMakeBidSteps = ({
  asset,
  price,
}: UseRequiredMakeBidSteps) => {
  const viewerAddress = useCurrentViewerAddress()
  const sdk = useNFTSwapv4()

  return useQuery(
    ["requiredBidSteps", asset, price],
    async () => {
      if (!viewerAddress) return suffixSteps
      return fetchRequiredMakeBidSteps({
        price: price!,
        address: viewerAddress,
        wrappedContractAddress: manifest.currency.wrapped.address,
        spender: sdk?.exchangeProxyContractAddress! as Address,
      })
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!viewerAddress && !!price,
    }
  )
}

export type UseMakeBidButtonOptions = {
  asset: AssetWithTradeData
}

export const useMakeBidButton = ({ asset }: UseMakeBidButtonOptions) => {
  const [price, setPrice] = useState<BigNumber | null>(null)

  const { data: requiredSteps, isLoading } = useRequiredMakeBidSteps({
    asset,
    price,
  })
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
