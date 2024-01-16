import { fetchNeedsMoreAllowance } from "@/services/allowance/needs-more-allowance"
import { fetchHasEnoughGas } from "@/services/balance/has-enough-gas"
// import { useLoader } from "@/services/loaders"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { useStepper } from "@/lib/utils/stepper"

import { fetchHasSufficientFunds } from "../../../services/balance/has-sufficient-funds"
import { useCurrentViewerAddress, useIsComethWallet } from "../auth"
import { BigNumber } from "ethers"

export type UseRequiredBuyingStepsOptions = {
  asset: AssetWithTradeData
}

export type BuyingStepValue = "add-funds" | "buy" | "confirmation"

export type BuyingStep = {
  label: string
  value: BuyingStepValue
}

const defaultSteps: BuyingStep[] = [
  { label: "Payment", value: "buy" }
]

export type FetchRequiredBuyingStepsOptions = {
  asset: AssetWithTradeData
  address: Address
  wrappedContractAddress: Address
  isComethWallet: boolean
}

export const fetchRequiredBuyingSteps = async ({
  asset,
  address,
  wrappedContractAddress,
  isComethWallet,
}: FetchRequiredBuyingStepsOptions) => {
  const rawPrice = asset.orderbookStats.lowestSalePrice
  if (!rawPrice) {
    throw new Error(
      `Asset has an invalid price, expected BigNumber, got '${rawPrice}'`
    )
  }
  const price = BigNumber.from(rawPrice)


  const displayAllowanceStep =
    !globalConfig.useNativeForOrders &&
    (await fetchNeedsMoreAllowance({
      address,
      price,
      contractAddress: wrappedContractAddress,
      spender: globalConfig.network.zeroExExchange,
    }))

  const missingFundsData = await fetchHasSufficientFunds({
    address,
    price,
  })
  const displayAddFundsStep = !missingFundsData?.hasSufficientFunds

  const { hasEnoughGas } = await fetchHasEnoughGas(address, isComethWallet)
  const displayAddGasStep = !hasEnoughGas

  const buyingSteps = [
    displayAddGasStep && { value: "add-gas", label: "Add gas" },
    displayAddFundsStep && { value: "add-funds", label: "Add funds" },
    displayAllowanceStep && { value: "allowance", label: "Permissions" },
    ...defaultSteps,
  ].filter(Boolean) as BuyingStep[]

  return buyingSteps
}

export const useRequiredBuyingSteps = ({
  asset,
}: UseRequiredBuyingStepsOptions) => {
  const viewerAddress = useCurrentViewerAddress()
  const isComethWallet = useIsComethWallet()
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
        isComethWallet
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
