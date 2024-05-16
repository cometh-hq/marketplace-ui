import { useEffect, useState } from "react"
import {
  useERC20Balance,
  useNativeBalance,
} from "@/services/balance/balanceService"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { useAcceptBuyOfferAssetButton } from "@/lib/web3/flows/acceptBuyOffer"
import { validateBuyOffer } from "@/lib/web3/flows/validateOrder"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { Button } from "@/components/ui/Button"
import { TransactionDialogButton } from "@/components/TransactionDialogButton"
import { Case, Switch } from "@/components/utils/Switch"

import { AddGasStep } from "../transaction-steps/AddGasStep"
import { CollectionApprovalStep } from "../transaction-steps/CollectionApprovalStep"
import { ConfirmAcceptBuyOfferStep } from "../transaction-steps/ConfirmAcceptBuyOfferStep"

export type AcceptBuyOfferButtonProps = {
  offer: OrderWithAsset
} & React.ComponentProps<typeof Button>

const useValidateBuyOffer = (order: OrderWithAsset) => {
  const [validationResult, setValidationResult] = useState<any>(null)
  const nftSwapSdk = useNFTSwapv4()
  const { balance: nativeBalance } = useNativeBalance(order.maker as Address)
  const { balance: erc20Balance } = useERC20Balance(
    globalConfig.ordersErc20.address,
    order.maker as Address
  )

  useEffect(() => {
    async function validate() {
      if (order.totalPrice && nftSwapSdk) {
        const validationResults = await validateBuyOffer({
          order,
          erc20Balance,
          nativeBalance,
          nftSwapSdk,
        })
        setValidationResult(validationResults)
      }
    }

    validate()
  }, [order, nativeBalance, nftSwapSdk, erc20Balance])

  return validationResult
}

const generateErrorMessages = (validationResult: any) => {
  let title = ""
  let message = ""

  if (
    validationResult &&
    validationResult.missingBalance &&
    !validationResult.missingBalance.isZero()
  ) {
    const missingBalanceValue = formatUnits(validationResult.missingBalance)
    title = "Insufficient Funds"
    message = `The offer cannot be accepted because the maker of the offer does not have enough MATIC in their balance. Please ensure that the maker has sufficient funds to cover the offer amount of ${missingBalanceValue} MATIC before proceeding.`
  }

  if (validationResult && validationResult.allowance) {
    title = "Allowance Required"
    message =
      "The maker of the offer has not granted the necessary allowance for this transaction. Please ask them to approve the required tokens and try again."
  }

  return { title, message }
}

export function AcceptBuyOfferButton({
  offer,
  size,
}: AcceptBuyOfferButtonProps) {
  const { requiredSteps, isLoading, currentStep, nextStep, reset } =
    useAcceptBuyOfferAssetButton({ offer })
  const [open, setOpen] = useState(false)
  const [errorMessages, setErrorMessages] = useState({ title: "", message: "" })

  const validationResult = useValidateBuyOffer(offer)

  useEffect(() => {
    const newErrorMessages = generateErrorMessages(validationResult)
    setErrorMessages(newErrorMessages)
  }, [validationResult])

  if (!requiredSteps?.length || !currentStep) return null

  const closeDialog = () => {
    setOpen(false)
  }

  const asset = offer.asset
  if (!asset) {
    return <div>Asset not found</div>
  }

  return (
    <TransactionDialogButton
      label="Accept"
      open={open}
      onOpenChange={setOpen}
      currentStep={currentStep}
      steps={requiredSteps}
      onClose={reset}
      size={size}
      isLoading={isLoading}
      error={errorMessages.title}
    >
      <Switch value={currentStep.value}>
        <Case value="add-gas">
          <AddGasStep onValid={nextStep} />
        </Case>
        <Case value="token-approval">
          <CollectionApprovalStep asset={asset} onValid={nextStep} />
        </Case>
        <Case value="confirm-accept-buy-offer">
          {errorMessages && errorMessages.title ? (
            <div className="flex flex-col gap-5 text-red-400">
              <h3 className="w-full text-center text-xl font-semibold">
                {errorMessages.title}
              </h3>
              <p className="w-full text-center"> {errorMessages.message}</p>
            </div>
          ) : (
            <ConfirmAcceptBuyOfferStep offer={offer} onValid={closeDialog} />
          )}
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
