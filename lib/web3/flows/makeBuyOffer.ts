import { useState } from "react"
import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { fetchNeedsMoreAllowance } from "@/services/allowance/allowanceService"
import {
  useERC20Balance,
  useNativeBalance,
} from "@/services/balance/balanceService"
import { computeHasSufficientFunds } from "@/services/balance/fundsService"
import { computeHasEnoughGas } from "@/services/balance/gasService"
import { computeNeedsToWrap } from "@/services/exchange/wrapService"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
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
  spender: Address
  isComethWallet: boolean
  nativeBalance?: bigint
  erc20Balance?: bigint
}

export const fetchRequiredMakeBuyOfferSteps = async ({
  price,
  address,
  spender,
  isComethWallet,
  nativeBalance,
  erc20Balance,
}: FetchRequiredBuyingStepsOptions) => {
  const { hasEnoughGas } = computeHasEnoughGas(
    address,
    isComethWallet,
    nativeBalance
  )
  const displayAddGasStep = !hasEnoughGas

  const displayAddFundsStep = price
    ? !computeHasSufficientFunds({
        nativeBalance,
        erc20Balance,
        price,
      })?.hasSufficientFunds
    : false

  const displayWrapStep =
    globalConfig.useNativeForOrders &&
    computeNeedsToWrap({
      price,
      nativeBalance,
      erc20Balance,
    })

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
  const { balance: nativeBalance } = useNativeBalance(viewerAddress)
  const { balance: erc20Balance } = useERC20Balance(
    globalConfig.ordersErc20.address
  )

  return useQuery({
    queryKey: ["requiredBuyingSteps", asset, price],
    queryFn: async () => {
      if (!viewerAddress) return suffixSteps
      return fetchRequiredMakeBuyOfferSteps({
        price: price!,
        address: viewerAddress,
        spender: nftSwapSdk?.exchangeProxyContractAddress! as Address,
        isComethWallet,
        nativeBalance,
        erc20Balance,
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
