import { BuyOffer } from "@/types/buy-offers"
import { useAcceptBuyOfferAssetButton } from "@/lib/web3/flows/accept-buy-offer"
import { TransactionDialogButton } from "@/components/dialog-button"
import { Case, Switch } from "@/components/utils/Switch"

import { ButtonLoading } from "../../../components/button-loading"
import { CollectionApprovalStep } from "../transaction-steps/collection-approval"
import { ConfirmAcceptBuyOfferStep } from "../transaction-steps/confirm-accept-buy-offer"
import { ConfirmationStep } from "../transaction-steps/confirmation"
import { useState } from "react"

export type AcceptBuyOfferButtonProps = {
  offer: BuyOffer
}

export function AcceptBuyOfferButton({ offer }: AcceptBuyOfferButtonProps) {
  const [txHash, setTxHash] = useState<string | null>(null)

  const { requiredSteps, isLoading, currentStep, nextStep, reset } =
    useAcceptBuyOfferAssetButton({ offer })

  if (isLoading) return <ButtonLoading size="lg" />
  if (!requiredSteps?.length || !currentStep) return null

  return (
    <TransactionDialogButton
      label="Accept"
      currentStep={currentStep}
      steps={requiredSteps}
      onClose={reset}
      variant="link"
      className="px-0"
    >
      <Switch value={currentStep.value}>
        <Case value="token-approval">
          <CollectionApprovalStep asset={offer.asset! || offer.trade} onValid={nextStep} />
        </Case>
        <Case value="confirm-accept-buy-offer">
          <ConfirmAcceptBuyOfferStep offer={offer} setTxHash={setTxHash} onValid={nextStep} />
        </Case>
        <Case value="confirmation">
          <ConfirmationStep txHash={txHash} />
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
