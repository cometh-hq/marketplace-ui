import { useState } from "react"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"

import { useBuyAssetButton } from "@/lib/web3/flows/buy"
import { Price } from "@/components/ui/Price"
import { TransactionDialogButton } from "@/components/TransactionDialogButton"
import { Case, Switch } from "@/components/utils/Switch"

import { AddGasStep } from "../transaction-steps/AddGasStep"
import { AllowanceStep } from "../transaction-steps/AllowanceStep"
import { BuyStep } from "../transaction-steps/BuyStep"
import { FundsStep } from "../transaction-steps/FundsStep"
import { UnwrapStep } from "../transaction-steps/UnwrapStep"
import { Button } from "@/components/ui/Button"

export type BuyAssetButtonProps = {
  asset: SearchAssetWithTradeData | AssetWithTradeData
 } & React.ComponentProps<typeof Button>

export function BuyAssetButton({
  asset,
  size = "lg",
}: BuyAssetButtonProps) {
  const { requiredSteps, isLoading, currentStep, nextStep, reset } =
    useBuyAssetButton({ asset })
  const [open, setOpen] = useState(false)

  if (!requiredSteps?.length || !currentStep) return null

  const assetPrice = asset.orderbookStats.lowestListingPrice ?? 0

  const closeDialog = () => {
    setOpen(false)
  }

  return (
    <TransactionDialogButton
      label={
        <>
          {size === "sm" ? (
            "Buy now"
          ) : (
            <span>
              Buy now for&nbsp;
              <Price amount={asset.orderbookStats.lowestListingPrice} />
            </span>
          )}
        </>
      }
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
        <Case value="add-funds">
          <FundsStep
            price={BigNumber.from(assetPrice ?? 0)}
            onValid={nextStep}
          />
        </Case>
        <Case value="unwrap-native-token">
          <UnwrapStep
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
          <BuyStep asset={asset} onValid={closeDialog} />
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
