import { useState } from "react"
import { AssetWithTradeData } from "@alembic/nft-api-sdk"
import { BigNumber } from "ethers"

import { useBuyAssetButton } from "@/lib/web3/flows/buy"
import { Price } from "@/components/ui/price"
import { TransactionDialogButton } from "@/components/dialog-button"
import { Case, Switch } from "@/components/utils/Switch"

import { BuyStep } from "../transaction-steps/buy"
import { ConfirmationStep } from "../transaction-steps/confirmation"
import { FundsStep } from "../transaction-steps/funds"

export type BuyAssetButtonProps = {
  asset: AssetWithTradeData
}

export function BuyAssetButton({ asset }: BuyAssetButtonProps) {
  const [txHash, setTxHash] = useState<string | null>(null)

  /**
   * TODO: Defer the calculation
   */
  const { requiredSteps, isLoading, currentStep, nextStep, reset } =
    useBuyAssetButton({ asset })
  if (!requiredSteps?.length || !currentStep) return null

  return (
    <TransactionDialogButton
      label={
        <>
          Buy now for <Price amount={asset.orderbookStats.lowestSalePrice} />
        </>
      }
      currentStep={currentStep}
      steps={requiredSteps}
      onClose={reset}
      isLoading={isLoading}
    >
      <Switch value={currentStep.value}>
        <Case value="add-funds">
          <FundsStep
            price={BigNumber.from(asset.orderbookStats.highestOfferPrice ?? 0)}
            onValid={nextStep}
          />
        </Case>
        <Case value="buy">
          <BuyStep asset={asset} onValid={nextStep} setTxHash={setTxHash} />
        </Case>
        <Case value="confirmation">
          <ConfirmationStep txHash={txHash} />
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
