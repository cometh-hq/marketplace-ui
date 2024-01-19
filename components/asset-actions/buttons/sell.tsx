import { AssetWithTradeData } from "@cometh/marketplace-sdk"

import { useSellAssetButton } from "@/lib/web3/flows/sell"
import { TransactionDialogButton } from "@/components/dialog-button"
import { Case, Switch } from "@/components/utils/Switch"

import { CollectionApprovalStep } from "../transaction-steps/collection-approval"
import { SellStep } from "../transaction-steps/sell"
import { AddGasStep } from "../transaction-steps/add-gas"
import { ButtonLoading } from "@/components/button-loading"
import { cn } from "@/lib/utils/utils"
import { useState } from "react"

export type SellAssetButtonProps = {
  asset: AssetWithTradeData
  isVariantLink?: boolean
}

export function SellAssetButton({ asset, isVariantLink }: SellAssetButtonProps) {
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

  const handleClose = () => {
    reset()
    setOpen(false)
  }

  return (
    <TransactionDialogButton
      open={open}
      label="Sell"
      currentStep={currentStep}
      steps={requiredSteps}
      onOpenChange={setOpen}
      onClose={handleClose}
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
          <SellStep asset={asset} onClose={handleClose}/>
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
