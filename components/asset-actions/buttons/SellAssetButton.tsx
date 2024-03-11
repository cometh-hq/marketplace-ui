import { useState } from "react"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"

import { cn } from "@/lib/utils/utils"
import { useSellAssetButton } from "@/lib/web3/flows/sell"
import { ButtonLoading } from "@/components/ButtonLoading"
import { TransactionDialogButton } from "@/components/TransactionDialogButton"
import { Case, Switch } from "@/components/utils/Switch"

import { AddGasStep } from "../transaction-steps/AddGasStep"
import { CollectionApprovalStep } from "../transaction-steps/CollectionApprovalStep"
import { SellStep } from "../transaction-steps/SellStep"

export type SellAssetButtonProps = {
  asset: AssetWithTradeData
  isVariantLink?: boolean
}

export function SellAssetButton({
  asset,
  isVariantLink,
}: SellAssetButtonProps) {
  const [open, setOpen] = useState(false)
  const { requiredSteps, isLoading, currentStep, nextStep, reset } =
    useSellAssetButton({ asset })

  if (isLoading) {
    return (
      <ButtonLoading
        size={isVariantLink ? "default" : "lg"}
        variant={isVariantLink ? "link" : "default"}
        className={cn(isVariantLink && "h-auto p-0")}
      />
    )
  }

  if (!requiredSteps?.length || !currentStep) return null

  const closeDialog = () => {
    setOpen(false)
  }

  return (
    <TransactionDialogButton
      open={open}
      label="Sell"
      currentStep={currentStep}
      steps={requiredSteps}
      onOpenChange={setOpen}
      onClose={reset}
      isVariantLink={isVariantLink}
      isLoading={isLoading}
      isDisabled={isLoading}
    >
      <Switch value={currentStep.value}>
        <Case value="add-gas">
          <AddGasStep onValid={nextStep} />
        </Case>
        <Case value="token-approval">
          <CollectionApprovalStep asset={asset} onValid={nextStep} />
        </Case>
        <Case value="sell">
          <SellStep asset={asset} onClose={closeDialog} />
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
