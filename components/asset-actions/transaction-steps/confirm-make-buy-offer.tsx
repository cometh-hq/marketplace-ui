import { useCallback } from "react"
import { useMakeBuyOfferAsset } from "@/services/orders/make-buy-offer"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"

import { Button } from "@/components/ui/button"
import { Price } from "@/components/ui/price"
import { ButtonLoading } from "@/components/button-loading"

export type ConfirmBuyOfferStepProps = {
  asset: AssetWithTradeData
  price: BigNumber
  validity: string
  onValid: () => void
}

export function ConfirmMakeBuyOfferStep({
  asset,
  price,
  validity,
  onValid,
}: ConfirmBuyOfferStepProps) {
  const { mutateAsync: makeBuyOffer, isLoading } = useMakeBuyOfferAsset()

  const onConfirm = useCallback(async () => {
    console.log("onConfirm")
    await makeBuyOffer({ asset, price, validity })
    onValid()
  }, [asset, makeBuyOffer, onValid, price])

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Summary</h3>
      <p>
        You are about to make an offer to buy <br />this asset for <Price size="default" amount={price} /> (fees included)
      </p>
      {isLoading ? (
        <ButtonLoading />
      ) : (
        <Button onClick={onConfirm}>Confirm</Button>
      )}
    </div>
  )
}
