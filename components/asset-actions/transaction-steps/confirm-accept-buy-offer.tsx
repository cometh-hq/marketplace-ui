import { useCallback } from "react"
import { useAcceptBuyOffer } from "@/services/orders/accept-buy-offer"
import { BigNumber } from "ethers"

import { BuyOffer } from "@/types/buy-offers"
import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { ButtonLoading } from "@/components/button-loading"
import { toast } from "@/components/ui/toast/use-toast"

export type ConfirmBuyOfferStepProps = {
  offer: BuyOffer
}

export function ConfirmAcceptBuyOfferStep({
  offer,
}: ConfirmBuyOfferStepProps) {
  const {
    mutateAsync: acceptBuyOffer,
    isPending,
    isSuccess
  } = useAcceptBuyOffer()

  const onConfirm = useCallback(async () => {
    const tx = await acceptBuyOffer({ offer })
    if (isSuccess) {
      toast({
        title: "Your offer has been accepted.",
        description: `${globalConfig.network.explorer}/${tx.transactionHash}`
      })
    }
  }, [acceptBuyOffer, offer, isSuccess])

  const amount = offer.trade.erc20TokenAmount
  const fees = offer.trade.totalFees
  const amountWithFees = BigNumber.from(amount).add(fees).toString()

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Summary</h3>
      <p className="text-center">
        You are about to accept an offer for <br />
        this asset for <Price size="default" amount={amountWithFees} />{" "}
        {globalConfig.ordersDisplayCurrency.symbol} (fees included)
      </p>
      {isPending ? (
        <ButtonLoading />
      ) : (
        <Button onClick={onConfirm}>Confirm</Button>
      )}
    </div>
  )
}
