import { useCallback } from "react"
import { useAcceptBuyOffer } from "@/services/orders/accept-buy-offer"
import { BigNumber } from "ethers"

import { BuyOffer } from "@/types/buy-offers"
import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { PriceDetails } from "@/components/ui/priceDetails"
import { toast } from "@/components/ui/toast/use-toast"
import { ButtonLoading } from "@/components/button-loading"

export type ConfirmBuyOfferStepProps = {
  offer: BuyOffer
  onValid: () => void
}

export function ConfirmAcceptBuyOfferStep({ offer, onValid }: ConfirmBuyOfferStepProps) {
  const {
    mutateAsync: acceptBuyOffer,
    isPending,
    isSuccess,
  } = useAcceptBuyOffer()

  const onConfirm = useCallback(async () => {
    const tx = await acceptBuyOffer({ offer })
    if (isSuccess) {
      toast({
        title: "The purchase offer for your NFT has been accepted with success!",
        description: `${globalConfig.network.explorer}/${tx.transactionHash}`,
      })
      onValid()
    }
  }, [acceptBuyOffer, offer, isSuccess])

  const amount = offer.trade.erc20TokenAmount
  const fees = offer.trade.totalFees
  const amountWithFees = BigNumber.from(amount).add(fees).toString()

  return (
    <div className="flex w-full flex-col justify-center gap-4 pt-4">
      <h3 className="w-full text-center text-xl font-semibold">Summary</h3>
      <p className="text-center">
        You are about to accept an offer for <br />
        this asset for <Price size="default" amount={amountWithFees} /> (fees
        included)
      </p>
      <PriceDetails fullPrice={amountWithFees} isEthersFormat={false} />

      {isPending ? (
        <ButtonLoading size="lg" />
      ) : (
        <Button onClick={onConfirm} size="lg">Confirm</Button>
      )}
    </div>
  )
}
