import { useCallback } from "react"
import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import { useMakeBuyOfferAsset } from "@/services/orders/makeBuyOfferService"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/Button"
import { Price } from "@/components/ui/Price"
import { ButtonLoading } from "@/components/ButtonLoading"

export type ConfirmBuyOfferStepProps = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
  price: BigNumber
  quantity: BigInt
  validity: string
  onValid: () => void
}

export function ConfirmMakeBuyOfferStep({
  asset,
  price,
  validity,
  quantity,
  onValid,
}: ConfirmBuyOfferStepProps) {
  const { mutateAsync: makeBuyOffer, isPending } = useMakeBuyOfferAsset(asset)
  const isComethWallet = useIsComethConnectWallet()

  const onConfirm = useCallback(async () => {
    await makeBuyOffer({ asset, price, validity, quantity })
    onValid()
  }, [asset, price, validity, makeBuyOffer, onValid, quantity])

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Summary</h3>
      <p className="text-center">
        You are about to make an offer to buy{" "}
        <span className="font-bold">{Number(quantity).toLocaleString()}</span>{" "}
        of this asset for{" "}
        <span>
          <Price size="default" amount={price} hideSymbol={false} />
        </span>{" "}
        (fees included).
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
