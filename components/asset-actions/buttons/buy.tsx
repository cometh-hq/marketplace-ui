import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"

import { useBuyAssetButton } from "@/lib/web3/flows/buy"
import { Price } from "@/components/ui/price"
import { TransactionDialogButton } from "@/components/dialog-button"
import { Case, Switch } from "@/components/utils/Switch"

import { AddGasStep } from "../transaction-steps/add-gas"
import { AllowanceStep } from "../transaction-steps/allowance"
import { BuyStep } from "../transaction-steps/buy"
import { FundsStep } from "../transaction-steps/funds"
import { UnwrapStep } from "../transaction-steps/unwrapStep"
import { useState } from "react"

export type BuyAssetButtonProps = {
  asset: SearchAssetWithTradeData | AssetWithTradeData
  isSmall?: boolean
  isLinkVariant?: boolean
}

export function BuyAssetButton({
  asset,
  isSmall = false,
  isLinkVariant = false,
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
          {isSmall ? (
            "Buy now"
          ) : (
            <span>
              Buy now for&nbsp;
              <Price amount={asset.orderbookStats.lowestListingPrice} isNativeToken={true} />
            </span>
          )}
        </>
      }
      open={open}
      onOpenChange={setOpen}
      currentStep={currentStep}
      steps={requiredSteps}
      onClose={reset}
      isLoading={isLoading}
      isDisabled={isLoading}
      isVariantLink={isLinkVariant}
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
