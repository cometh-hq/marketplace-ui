import { useState } from "react"
import { OrderWithAsset } from "@cometh/marketplace-sdk"

import { useAcceptBuyOfferAssetButton } from "@/lib/web3/flows/acceptBuyOffer"
import { Button } from "@/components/ui/Button"
import { TransactionDialogButton } from "@/components/TransactionDialogButton"
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
    </TransactionDialogButton>
  )
}
