import { AssetWithTradeData } from "@cometh/marketplace-sdk"

import { useSellAssetButton } from "@/lib/web3/flows/sell"
import { TransactionDialogButton } from "@/components/dialog-button"
import { Case, Switch } from "@/components/utils/Switch"

import { CollectionApprovalStep } from "../transaction-steps/collection-approval"
import { ConfirmationStep } from "../transaction-steps/confirmation"
import { SellStep } from "../transaction-steps/sell"
import { AddGasStep } from "../transaction-steps/add-gas"
import { ButtonLoading } from "@/components/button-loading"
import { cn } from "@/lib/utils/utils"

export type SellAssetButtonProps = {
  asset: AssetWithTradeData
  isVariantLink?: boolean
}

export function SellAssetButton({ asset, isVariantLink }: SellAssetButtonProps) {
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

  return (
    <TransactionDialogButton
      label="Sell"
      currentStep={currentStep}
      steps={requiredSteps}
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
          <SellStep asset={asset} onValid={nextStep} />
        </Case>
        <Case value="confirmation">
          <ConfirmationStep />
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
