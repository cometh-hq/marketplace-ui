import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { fetchNeedsMoreAllowance } from "@/services/allowance/allowanceService"
import {
  useERC20Balance,
  useNativeBalance,
} from "@/services/balance/balanceService"
import { computeHasSufficientFunds } from "@/services/balance/fundsService"
import { computeHasEnoughGas } from "@/services/balance/gasService"
import { computeNeedToUnwrap } from "@/services/exchange/unwrapService"
import {
  AssetWithTradeData,
  OrderWithAsset,
  SearchAssetWithTradeData,
  TokenType
} from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"
import { useAccount } from "wagmi"

import { OrderAsset } from "@/types/assets"
import globalConfig from "@/config/globalConfig"
import { useStepper } from "@/lib/utils/stepper"

export type UseRequiredBuyingStepsOptions = {
  asset: AssetWithTradeData | SearchAssetWithTradeData | OrderAsset
  order?: OrderWithAsset
}

export type BuyingStepValue = "add-funds" | "buy" | "confirmation"

export type BuyingStep = {
  label: string
  value: BuyingStepValue
}

const defaultSteps: BuyingStep[] = [{ label: "Payment", value: "buy" }]

export type FetchRequiredBuyingStepsOptions = {
  asset: AssetWithTradeData | SearchAssetWithTradeData | OrderAsset
  order?: OrderWithAsset
  address: Address
  isComethWallet: boolean
  nativeBalance?: bigint
  erc20Balance?: bigint
}

export const fetchRequiredBuyingSteps = async ({
  asset,
  order,
  address,
  isComethWallet,
  nativeBalance,
  erc20Balance,
}: FetchRequiredBuyingStepsOptions) => {
  if (!order) {
    return []
  }
  const rawPrice = order.totalPrice
  if (!rawPrice) {
    throw new Error(
      `Asset has an invalid price, expected BigNumber, got '${rawPrice}'`
    )
  }
  const price = BigNumber.from(rawPrice)
  const isErc1155 = asset.tokenType === TokenType.ERC1155

  const displayAllowanceStep =
    !globalConfig.useNativeForOrders &&
    (await fetchNeedsMoreAllowance({
      address,
      price,
      contractAddress: globalConfig.ordersErc20.address,
      spender: globalConfig.network.zeroExExchange,
    }))

  const missingFundsData = computeHasSufficientFunds({
    price,
    nativeBalance,
    erc20Balance,
  })
  const displayAddFundsStep = !missingFundsData?.hasSufficientFunds

  const needsToUnwrapData = computeNeedToUnwrap({
    price,
    isComethWallet,
    nativeBalance,
    wrappedBalance: erc20Balance,
  })
  const displayAddUnwrappedNativeTokenStep =
    needsToUnwrapData.needsToUnwrap &&
    globalConfig.useNativeForOrders &&
    !displayAddFundsStep

  const { hasEnoughGas } = computeHasEnoughGas(address, isComethWallet, nativeBalance)
  const displayAddGasStep = !hasEnoughGas

  const buyingSteps = [
    displayAddGasStep && { value: "add-gas", label: "Add gas" },
    isErc1155 && { value: "buy-quantity", label: "Quantity" },
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
  order,
}: UseRequiredBuyingStepsOptions) => {
  const account = useAccount()
  const viewerAddress = account.address
  const isComethWallet = useIsComethConnectWallet()
  const { balance: nativeBalance } = useNativeBalance(viewerAddress)
  const { balance: erc20Balance } = useERC20Balance(
    globalConfig.ordersErc20.address
  )
  return useQuery({
    queryKey: ["requiredBuyingSteps", asset, viewerAddress],
    queryFn: async () => {
      if (!viewerAddress) {
        throw new Error("Could not find viewer address")
      }
      const steps = await fetchRequiredBuyingSteps({
        asset,
        order: order,
        address: viewerAddress,
        nativeBalance,
        erc20Balance,
        isComethWallet,
      })

      return steps
    },

    enabled: !!viewerAddress && !!order,
  })
}

export type UseBuyAssetButtonOptions = {
  asset: AssetWithTradeData | SearchAssetWithTradeData | OrderAsset
  order?: OrderWithAsset
}

export const useBuyAssetButton = ({
  asset,
  order,
}: UseBuyAssetButtonOptions) => {
  const { data: requiredSteps, isLoading: requiredStepsLoading } =
    useRequiredBuyingSteps({ asset, order })
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
