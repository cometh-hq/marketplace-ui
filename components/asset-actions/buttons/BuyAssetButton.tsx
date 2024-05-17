import { useMemo, useState } from "react"
import { useCheapestListing } from "@/services/cometh-marketplace/buyOffersService"
import {
  AssetWithTradeData,
  OrderWithAsset,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"

import { OrderAsset } from "@/types/assets"
import { useBuyAssetButton } from "@/lib/web3/flows/buy"
import { useValidateSellListing } from "@/lib/web3/hooks/useValidateSellListing"
import { Button } from "@/components/ui/Button"
import { Price } from "@/components/ui/Price"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"
import { TransactionDialogButton } from "@/components/TransactionDialogButton"
import { Case, Switch } from "@/components/utils/Switch"

import { AddGasStep } from "../transaction-steps/AddGasStep"
import { AllowanceStep } from "../transaction-steps/AllowanceStep"
import { BuyQuantityStep } from "../transaction-steps/BuyQuantityStep"
import { BuyStep } from "../transaction-steps/BuyStep"
import { FundsStep } from "../transaction-steps/FundsStep"
import { UnwrapStep } from "../transaction-steps/UnwrapStep"

export type BuyAssetButtonProps = {
  asset: SearchAssetWithTradeData | AssetWithTradeData | OrderAsset
  listing?: OrderWithAsset
} & React.ComponentProps<typeof Button>

const useDefinedOrCheapestOrder = (
  tokenAddress: string,
  tokenId: string,
  order?: OrderWithAsset
) => {
  const { data: cheapestListing } = useCheapestListing(tokenAddress, tokenId)

  if (order) return order
  return cheapestListing
}

export function BuyAssetButton({
  asset,
  listing,
  size = "lg",
}: BuyAssetButtonProps) {
  const order = useDefinedOrCheapestOrder(
    asset.contractAddress,
    asset.tokenId,
    listing
  )
  const { requiredSteps, isLoading, currentStep, nextStep, reset } =
    useBuyAssetButton({ asset, order })
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(BigInt(1))
  const unitPrice = order?.totalUnitPrice

  const transactionPrice = useMemo(
    () => (unitPrice ? BigInt(unitPrice) * quantity : BigInt(0)),
    [unitPrice, quantity]
  )
  const isErc1155 = useAssetIs1155(asset)

  const validationResult = useValidateSellListing(
    asset,
    order as OrderWithAsset,
    isErc1155,
    open
  )

  console.log({ validationResult })
  if (!requiredSteps?.length || !currentStep || !order) return null

  const closeDialog = () => {
    setQuantity(BigInt(1))
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
              <Price amount={unitPrice} />
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
        <Case value="buy-quantity">
          <BuyQuantityStep
            asset={asset}
            order={order}
            quantity={quantity}
            setQuantity={setQuantity}
            onValid={nextStep}
          />
        </Case>
        <Case value="add-funds">
          <FundsStep
            price={BigNumber.from(transactionPrice)}
            onValid={nextStep}
          />
        </Case>
        <Case value="unwrap-native-token">
          <UnwrapStep
            price={BigNumber.from(transactionPrice)}
            onValid={nextStep}
          />
        </Case>
        <Case value="allowance">
          <AllowanceStep
            price={BigNumber.from(transactionPrice)}
            onValid={nextStep}
          />
        </Case>
        <Case value="buy">
          <BuyStep
            asset={asset}
            order={order}
            onValid={closeDialog}
            quantity={quantity}
            transactionPrice={transactionPrice}
          />
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
