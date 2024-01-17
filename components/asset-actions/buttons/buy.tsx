import { useState } from "react"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"

import { useBuyAssetButton } from "@/lib/web3/flows/buy"
import { Price } from "@/components/ui/price"
import { TransactionDialogButton } from "@/components/dialog-button"
import { Case, Switch } from "@/components/utils/Switch"

import { AllowanceStep } from "../transaction-steps/allowance"
import { BuyStep } from "../transaction-steps/buy"
import { FundsStep } from "../transaction-steps/funds"
import { AddGasStep } from "../transaction-steps/add-gas"

export type BuyAssetButtonProps = {
  asset: AssetWithTradeData
}

export function BuyAssetButton({ asset }: BuyAssetButtonProps) {
  const { requiredSteps, isLoading, currentStep, nextStep, reset } =
    useBuyAssetButton({ asset })

  if (!requiredSteps?.length || !currentStep) return null

  const assetPrice = asset.orderbookStats.lowestSalePrice ?? 0

  return (
    <TransactionDialogButton
      label={
        <>
          Buy now for&nbsp;<Price amount={asset.orderbookStats.lowestSalePrice} />
        </>
      }
      currentStep={currentStep}
      steps={requiredSteps}
      onClose={reset}
      isLoading={isLoading}
      isDisabled={isLoading}
    >
      <Switch value={currentStep.value}>
        <Case value="add-gas">
          <AddGasStep onValid={nextStep} />
        </Case>
        <Case value="add-funds">
          <FundsStep
            price={BigNumber.from(assetPrice ?? 0)}
            onValid={nextStep}
          />
        </Case>
        <Case value="allowance">
          <AllowanceStep
            price={BigNumber.from(assetPrice ?? 0)}
            onValid={nextStep}
          />
        </Case>
        <Case value="buy">
          <BuyStep asset={asset} onValid={reset} />
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
