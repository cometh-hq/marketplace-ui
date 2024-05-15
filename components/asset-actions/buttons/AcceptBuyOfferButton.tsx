import { off } from "process"
import { useEffect, useState } from "react"
import {
  useERC20Balance,
  useNativeBalance,
} from "@/services/balance/balanceService"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { useAcceptBuyOfferAssetButton } from "@/lib/web3/flows/acceptBuyOffer"
import { validateBuyOffer } from "@/lib/web3/flows/validateOrder"
import { useNFTSwapv4 } from "@/lib/web3/nft-swap-sdk"
import { Button } from "@/components/ui/Button"
import { TransactionDialogButton } from "@/components/TransactionDialogButton"
import { Case, Switch } from "@/components/utils/Switch"

import { AddGasStep } from "../transaction-steps/AddGasStep"
import { CollectionApprovalStep } from "../transaction-steps/CollectionApprovalStep"
import { ConfirmAcceptBuyOfferStep } from "../transaction-steps/ConfirmAcceptBuyOfferStep"

export type AcceptBuyOfferButtonProps = {
  offer: OrderWithAsset
} & React.ComponentProps<typeof Button>

function useValidateBuyOffer(order: OrderWithAsset) {
  const [validationResult, setValidationResult] = useState<any>(null)
  const nftSwapSdk = useNFTSwapv4()
  const { balance: nativeBalance } = useNativeBalance(order.maker as Address)

  const { balance: erc20Balance } = useERC20Balance(
    globalConfig.ordersErc20.address,
    order.maker as Address
  )

  console.log("!!", order)
  console.log("erc20Balance", erc20Balance)
  console.log("nativeBalance", nativeBalance)
  console.log("totalprice", BigNumber.from(order.totalPrice))

  useEffect(() => {
    async function validate() {
      if (order.totalPrice && nftSwapSdk && erc20Balance) {
        const validationResults = await validateBuyOffer({
          order,
          erc20Balance,
          nativeBalance,
          nftSwapSdk,
        })
        setValidationResult(validationResults)
      }
    }

    validate()
  }, [order, nativeBalance, nftSwapSdk, erc20Balance])

  return validationResult
}

export function AcceptBuyOfferButton({
  offer,
  size,
}: AcceptBuyOfferButtonProps) {
  const { requiredSteps, isLoading, currentStep, nextStep, reset } =
    useAcceptBuyOfferAssetButton({ offer })
  const [open, setOpen] = useState(false)

  const validationResult = useValidateBuyOffer(offer)

  if (!requiredSteps?.length || !currentStep) return null

  const closeDialog = () => {
    setOpen(false)
  }

  const asset = offer.asset
  if (!asset) {
    return <div>Asset not found</div>
  }

  console.log("validationResult", { validationResult })
  
  return (
    <TransactionDialogButton
      label="Accept"
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
        <Case value="token-approval">
          <CollectionApprovalStep asset={asset} onValid={nextStep} />
        </Case>
        <Case value="confirm-accept-buy-offer">
          <ConfirmAcceptBuyOfferStep offer={offer} onValid={closeDialog} />
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
