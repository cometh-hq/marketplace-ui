import { useCallback } from "react"
import { useMakeBuyOfferAsset } from "@/services/orders/make-buy-offer"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"

import globalConfig from "@/config/globalConfig"
import { useIsComethWallet } from "@/lib/web3/auth"
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
  const { mutateAsync: makeBuyOffer, isPending } = useMakeBuyOfferAsset(asset)
  const isComethWallet = useIsComethWallet()

  const onConfirm = useCallback(async () => {
    await makeBuyOffer({ asset, price, validity })
    onValid()
  }, [asset, price, validity, makeBuyOffer, onValid])

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Summary</h3>
      <p className="text-center">
        You are about to make an offer to buy <br />
        this asset for{" "}
        <Price size="default" amount={price} hideSymbol={false} /> (fees
        included). <br />
        {globalConfig.areContractsSponsored && isComethWallet && (
          <>This contract is sponsored, so you won&apos;t pay any gas fees.</>
        )}
      </p>
      {isPending ? (
        <ButtonLoading />
      ) : (
        <Button onClick={onConfirm}>Confirm</Button>
      )}
    </div>
  )
}
