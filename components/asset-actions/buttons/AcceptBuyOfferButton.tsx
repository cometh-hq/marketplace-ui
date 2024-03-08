import { useState } from "react"

import { BuyOffer } from "@/types/buy-offers"
import { useAcceptBuyOfferAssetButton } from "@/lib/web3/flows/acceptBuyOffer"
import { TransactionDialogButton } from "@/components/TransactionDialogButton"
import { Case, Switch } from "@/components/utils/Switch"

import { AddGasStep } from "../transaction-steps/AddGasStep"
import { CollectionApprovalStep } from "../transaction-steps/CollectionApprovalStep"
import { ConfirmAcceptBuyOfferStep } from "../transaction-steps/ConfirmAcceptBuyOfferStep"

export type AcceptBuyOfferButtonProps = {
  offer: BuyOffer
}

export function AcceptBuyOfferButton({ offer }: AcceptBuyOfferButtonProps) {
  const { requiredSteps, isLoading, currentStep, nextStep, reset } =
    useAcceptBuyOfferAssetButton({ offer })
  const [open, setOpen] = useState(false)

  if (!requiredSteps?.length || !currentStep) return null

  const closeDialog = () => {
    setOpen(false)
  }

  return (
    <TransactionDialogButton
      label="Accept"
      open={open}
      onOpenChange={setOpen}
      currentStep={currentStep}
      steps={requiredSteps}
      onClose={reset}
      isVariantLink={true}
      isLoading={isLoading}
      isDisabled={isLoading}
    >
      <Switch value={currentStep.value}>
        <Case value="add-gas">
          <AddGasStep onValid={nextStep} />
        </Case>
        <Case value="token-approval">
          <CollectionApprovalStep
            asset={offer.asset! || offer.trade}
            onValid={nextStep}
          />
        </Case>
        <Case value="confirm-accept-buy-offer">
          <ConfirmAcceptBuyOfferStep offer={offer} onValid={closeDialog} />
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
