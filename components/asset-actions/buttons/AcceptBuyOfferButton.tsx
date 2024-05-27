import { useEffect, useState } from "react"
import { OrderWithAsset } from "@cometh/marketplace-sdk"

import { useAcceptBuyOfferAssetButton } from "@/lib/web3/flows/acceptBuyOffer"
import { useValidateBuyOffer } from "@/lib/web3/hooks/useValidateBuyOffer"
import { Button } from "@/components/ui/Button"
import {
  ErrorMessageDisplay,
  LoadingOrError,
} from "@/components/ui/LoadingOrError"
import { TransactionDialogButton } from "@/components/TransactionDialogButton"
import { generateErrorMessages } from "@/components/utils/OrderErrorMessages"
import { Case, Switch } from "@/components/utils/Switch"

import { AddGasStep } from "../transaction-steps/AddGasStep"
import { CollectionApprovalStep } from "../transaction-steps/CollectionApprovalStep"
import { ConfirmAcceptBuyOfferStep } from "../transaction-steps/ConfirmAcceptBuyOfferStep"

export type AcceptBuyOfferButtonProps = {
  offer: OrderWithAsset
} & React.ComponentProps<typeof Button>

export function AcceptBuyOfferButton({
  offer,
  size,
}: AcceptBuyOfferButtonProps) {
  const { requiredSteps, isLoading, currentStep, nextStep, reset } =
    useAcceptBuyOfferAssetButton({ offer })
  const [open, setOpen] = useState(false)
  const [errorMessages, setErrorMessages] = useState({ title: "", message: "" })

  const { validationResult, isLoadingValidation } = useValidateBuyOffer(
    offer,
    open
  )

  useEffect(() => {
    if (validationResult) {
      const newErrorMessages = generateErrorMessages(validationResult)
      setErrorMessages(newErrorMessages)
    }
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
      isLoading={isLoading || isLoadingValidation}
      error={errorMessages.title}
    >
      <LoadingOrError
        isLoading={isLoadingValidation}
        errorMessages={errorMessages}
      >
        <Switch value={currentStep.value}>
          <Case value="add-gas">
            <AddGasStep onValid={nextStep} />
          </Case>
          <Case value="token-approval">
            <CollectionApprovalStep asset={asset} onValid={nextStep} />
          </Case>
          <Case value="confirm-accept-buy-offer">
            <ConfirmAcceptBuyOfferStep offer={offer} onValid={closeDialog} />
          </Case>
        </Switch>
      </LoadingOrError>
    </TransactionDialogButton>
  )
}
