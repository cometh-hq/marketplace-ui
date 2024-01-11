import { manifest } from "@/manifests"
// import { useLoader } from "@/services/loaders"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"
import { parseUnits } from "ethers/lib/utils"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { useStepper } from "@/lib/utils/stepper"

import { fetchHasSufficientFunds } from "../../../services/balance/has-sufficient-funds"
import { useCurrentViewerAddress } from "../auth"

export type UseRequiredBuyingStepsOptions = {
  asset: AssetWithTradeData
}

export type BuyingStepValue = "add-funds" | "buy" | "confirmation"

export type BuyingStep = {
  label: string
  value: BuyingStepValue
}

const defaultSteps: BuyingStep[] = [
  { label: "Payment", value: "buy" },
  { label: "All set", value: "confirmation" },
]

export type FetchRequiredBuyingStepsOptions = {
  asset: AssetWithTradeData
  address: Address
  wrappedContractAddress: Address
}

export const fetchRequiredBuyingSteps = async ({
  asset,
  address,
  wrappedContractAddress,
}: FetchRequiredBuyingStepsOptions) => {
  const _price = asset.orderbookStats.lowestSalePrice
  if (!_price) {
    throw new Error(
      `Asset has an invalid price, expected BigNumber, got '${_price}'`
    )
  }

  const price = parseUnits(_price, 18)

  const displayAddFundsStep = !(
    await fetchHasSufficientFunds({
      address,
      price
    })
  )?.hasSufficientFunds

  const buyingSteps = [
    displayAddFundsStep && { value: "add-funds", label: "Add funds" },
    ...defaultSteps,
  ].filter(Boolean) as BuyingStep[]

  return buyingSteps
}

export const useRequiredBuyingSteps = ({
  asset,
}: UseRequiredBuyingStepsOptions) => {
  const viewerAddress = useCurrentViewerAddress()

  return useQuery({
    queryKey: ["requiredBuyingSteps", asset, viewerAddress],
    queryFn: async () => {
      if (!viewerAddress) {
        throw new Error("Could not find viewer address")
      }
      const steps = await fetchRequiredBuyingSteps({
        asset,
        address: viewerAddress,
        wrappedContractAddress: globalConfig.network.wrappedNativeToken.address,
      })

      return steps
    },

    enabled: !!viewerAddress,
  })
}

export type UseBuyAssetButtonOptions = {
  asset: AssetWithTradeData
}

export const useBuyAssetButton = ({ asset }: UseBuyAssetButtonOptions) => {
  const { data: requiredSteps, isLoading: requiredStepsLoading } =
    useRequiredBuyingSteps({ asset })
  const { nextStep, currentStep, reset } = useStepper({ steps: requiredSteps })

  const isLoading = requiredStepsLoading

  return {
    requiredSteps,
    currentStep,
    isLoading,
    nextStep,
    reset,
  }
}
