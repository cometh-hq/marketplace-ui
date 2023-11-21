import { useCallback } from "react"
import { useBuyAsset } from "@/services/orders/buy-asset"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"

import { Button } from "@/components/ui/button"
import { InfoBox } from "@/components/ui/message-box"
import { Price } from "@/components/ui/price"
import { AssetHeaderImage } from "@/components/marketplace/asset/image"
import { SwitchNetwork } from "../buttons/switch-network"
import { ButtonLoading } from "@/components/button-loading"

export type BuyStepProps = {
  asset: AssetWithTradeData
  onValid: () => void
  setTxHash: (txHash: string) => void
}

/**
 * Arriving at this stage means that the user has sufficient funds
 * so we don't have to do any check here
 */
export function BuyStep({ asset, onValid, setTxHash }: BuyStepProps) {
  const { mutateAsync: buy, isLoading, isError } = useBuyAsset()

  /**
   * TODO: check what happens if the modal
   * is closed before the transaction is confirmed
   */
  const onSubmit = useCallback(async () => {
    const tx = await buy({ asset: asset })
    if (tx) setTxHash(tx.transactionHash)
    if (!isError) onValid()
  }, [asset, buy, onValid, setTxHash])

  return (
    <div className="flex flex-col items-center justify-center gap-[16px] pt-[16px]">
      <AssetHeaderImage asset={asset} />

      <InfoBox
        title="Secured Transaction"
        description="This transaction is secured by the blockchain. You will be prompted to confirm the transaction in your wallet."
      />

      <SwitchNetwork>
        {isLoading ? (
          <ButtonLoading />
        ) : (
          <Button className="flex gap-1" onClick={onSubmit}>
            Buy now for <Price amount={asset.orderbookStats.lowestSalePrice} />
          </Button>
        )}
      </SwitchNetwork>
    </div>
  )
}
