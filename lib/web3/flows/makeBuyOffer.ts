import { useState } from "react"
import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { fetchNeedsMoreAllowance } from "@/services/allowance/allowanceService"
import { fetchHasSufficientFunds } from "@/services/balance/fundsService"
import { fetchHasEnoughGas } from "@/services/balance/gasService"
import { fetchNeedsToWrap } from "@/services/exchange/wrapService"
import { AssetWithTradeData, SearchAssetWithTradeData } from "@cometh/marketplace-sdk"
import { useQuery } from "@tanstack/react-query"
import { BigNumber } from "ethers"
import { Address } from "viem"
import { useAccount } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { useStepper } from "@/lib/utils/stepper"

import { useNFTSwapv4 } from "../nft-swap-sdk"

export type UseRequiredMakeBuyOfferSteps = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
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
]

export type FetchRequiredBuyingStepsOptions = {
  price: BigNumber
  address: Address
  wrappedContractAddress: Address
  spender: Address
  isComethWallet: boolean
}

export const fetchRequiredMakeBuyOfferSteps = async ({
  price,
  address,
  wrappedContractAddress,
  spender,
  isComethWallet,
}: FetchRequiredBuyingStepsOptions) => {
  const { hasEnoughGas } = await fetchHasEnoughGas(address, isComethWallet)
  const displayAddGasStep = !hasEnoughGas

  const displayAddFundsStep = price
    ? !(
        await fetchHasSufficientFunds({
          address,
          price,
        })
      )?.hasSufficientFunds
    : false

  const displayWrapStep =
    globalConfig.useNativeForOrders &&
    (await fetchNeedsToWrap({
      price,
      address,
      wrappedContractAddress,
    }))

  const displaysAllowanceStep = price
    ? await fetchNeedsMoreAllowance({
        address,
        price,
        contractAddress: globalConfig.ordersErc20.address,
        spender,
      })
    : false

  const makeBuyOfferSteps = [
    displayAddGasStep && { value: "add-gas", label: "Add gas" },
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
  const account = useAccount()
  const viewerAddress = account.address
  const isComethWallet = useIsComethConnectWallet()
  const nftSwapSdk = useNFTSwapv4()

  return useQuery({
    queryKey: ["requiredBuyingSteps", asset, price],
    queryFn: async () => {
      if (!viewerAddress) return suffixSteps
      return fetchRequiredMakeBuyOfferSteps({
        price: price!,
        address: viewerAddress,
        wrappedContractAddress: globalConfig.network.wrappedNativeToken.address,
        spender: nftSwapSdk?.exchangeProxyContractAddress! as Address,
        isComethWallet,
      })
    },

    refetchOnWindowFocus: false,
    enabled: !!viewerAddress && !!price,
  })
}

export type UseMakeBuyOfferAssetButtonOptions = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
}

export const useMakeBuyOfferAssetButton = ({
  asset,
}: UseMakeBuyOfferAssetButtonOptions) => {
  const [price, setPrice] = useState<BigNumber | null>(null)
  const [quantity, setQuantity] = useState<BigInt>(BigInt(1))
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
    quantity,
    setQuantity,
    validity,
    setValidity,
    refetch,
  }
}
