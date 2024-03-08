import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { fetchNeedsMoreAllowance } from "@/services/allowance/allowanceService"
import { fetchHasSufficientFunds } from "@/services/balance/fundsService"
import { fetchHasEnoughGas } from "@/services/balance/gasService"
import { fetchNeedsToUnwrap } from "@/services/exchange/unwrapService"
import { AssetWithTradeDataCore } from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"
import { useAccount } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { useStepper } from "@/lib/utils/stepper"

export type UseRequiredBuyingStepsOptions = {
  asset: AssetWithTradeDataCore
}

export type BuyingStepValue = "add-funds" | "buy" | "confirmation"

export type BuyingStep = {
  label: string
  value: BuyingStepValue
}

const defaultSteps: BuyingStep[] = [{ label: "Payment", value: "buy" }]

export type FetchRequiredBuyingStepsOptions = {
  asset: AssetWithTradeDataCore
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
  const rawPrice = asset.orderbookStats.lowestListingPrice
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

  const needsToUnwrapData = await fetchNeedsToUnwrap({
    address,
    price,
  })
  const displayAddUnwrappedNativeTokenStep =
    needsToUnwrapData.needsToUnwrap &&
    globalConfig.useNativeForOrders &&
    !displayAddFundsStep

  const { hasEnoughGas } = await fetchHasEnoughGas(address, isComethWallet)
  const displayAddGasStep = !hasEnoughGas

  const buyingSteps = [
    displayAddGasStep && { value: "add-gas", label: "Add gas" },
    displayAddFundsStep && { value: "add-funds", label: "Add funds" },
    displayAddUnwrappedNativeTokenStep && {
      value: "unwrap-native-token",
      label: "Unwrap",
    },
    displayAllowanceStep && { value: "allowance", label: "Permissions" },
    ...defaultSteps,
  ].filter(Boolean) as BuyingStep[]

  return buyingSteps
}

export const useRequiredBuyingSteps = ({
  asset,
}: UseRequiredBuyingStepsOptions) => {
  const account = useAccount()
  const viewerAddress = account.address
  const isComethWallet = useIsComethConnectWallet()
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
        isComethWallet,
      })

      return steps
    },

    enabled: !!viewerAddress,
  })
}

export type UseBuyAssetButtonOptions = {
  asset: AssetWithTradeDataCore
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
