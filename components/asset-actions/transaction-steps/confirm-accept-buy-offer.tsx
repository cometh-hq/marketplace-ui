import { useCallback } from "react"
import { useAcceptBuyOffer } from "@/services/orders/accept-buy-offer"

import { BuyOffer } from "@/types/buy-offers"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { ButtonLoading } from "@/components/button-loading"
import { BigNumber } from "ethers"

export type ConfirmBuyOfferStepProps = {
  offer: BuyOffer
  onValid: () => void
  setTxHash: (txHash: string) => void
}

export function ConfirmAcceptBuyOfferStep({
  offer,
  onValid,
  setTxHash,
}: ConfirmBuyOfferStepProps) {
  const { mutateAsync: acceptBuyOffer, isLoading, isError } = useAcceptBuyOffer()

  const onConfirm = useCallback(async () => {
    const tx = await acceptBuyOffer({ offer })
    if (tx) setTxHash(tx.transactionHash)
    if (!isError) onValid()
  }, [acceptBuyOffer, offer, onValid])

  const amount = offer.trade.erc20TokenAmount
  const fees = offer.trade.totalFees
  const amountWithFees = BigNumber.from(amount).add(fees).toString()

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Summary</h3>
      <p>
        You are about to accept an offer for <br />this asset for <Price size="default" amount={amountWithFees} /> (fees included)
      </p>
      {isLoading ? (
        <ButtonLoading />
      ) : (
        <Button onClick={onConfirm}>Confirm</Button>
      )}
    </div>
  )
}
