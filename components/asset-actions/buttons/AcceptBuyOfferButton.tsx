import { useEffect, useState } from "react"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { Loader } from "lucide-react"

import { useAcceptBuyOfferAssetButton } from "@/lib/web3/flows/acceptBuyOffer"
import { useValidateBuyOffer } from "@/lib/web3/hooks/useValidateBuyOffer"
import { Button } from "@/components/ui/Button"
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
  const [isValidationLoading, setIsValidationLoading] = useState(false)

  const validationResult = useValidateBuyOffer(offer, open)

  useEffect(() => {
    if (open) {
      setIsValidationLoading(true)
    }
  }, [open])

  useEffect(() => {
    if (validationResult) {
      const newErrorMessages = generateErrorMessages(validationResult)
      setErrorMessages(newErrorMessages)
    }
    setIsValidationLoading(false)
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
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          setIsValidationLoading(false)
        }
      }}
      currentStep={currentStep}
      steps={requiredSteps}
      onClose={reset}
      size={size}
      isLoading={isLoading || isValidationLoading}
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
          {isValidationLoading ? (
            <div className="flex items-center justify-center ">
              <Loader size={22} className="animate-spin" />
            </div>
          ) : errorMessages.title ? (
            <div className="flex flex-col gap-5 ">
              <h3 className="w-full text-center text-xl font-semibold">
                {errorMessages.title}
              </h3>
              <p className="w-full text-center">{errorMessages.message}</p>
            </div>
          ) : (
            <ConfirmAcceptBuyOfferStep offer={offer} onValid={closeDialog} />
          )}
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
