import { useCallback, useMemo, useState } from "react"
import { useSellAsset } from "@/services/orders/sellAssetService"
import { AssetWithTradeData, SearchAssetWithTradeData } from "@cometh/marketplace-sdk"
import { parseUnits } from "ethers/lib/utils"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Price } from "@/components/ui/Price"
import { PriceDetails } from "@/components/ui/PriceDetails"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { AssetHeaderImage } from "@/components/marketplace/asset/AssetHeaderImage"

import { SwitchNetwork } from "../buttons/SwitchNetwork"
import AssetFloorPriceLine from "@/components/marketplace/asset/floorPrice/AssetFloorPriceLine"
import { OrderExpirySelect } from "../buttons/OrderExpirySelect"

export type SellStepProps = {
  asset: AssetWithTradeData | SearchAssetWithTradeData
  onClose: () => void
}

const DEFAULT_VALIDITY = "3"

/**
 * Arriving at this stage means that the user has approved the collection
 * so we don't have to do any check here
 *
 */
export function SellStep({ asset, onClose }: SellStepProps) {
  const { mutateAsync: sell, isPending } = useSellAsset(asset)
  const [price, setPrice] = useState("")
  const [validity, setValidity] = useState(DEFAULT_VALIDITY)

  const orderParams = useMemo(() => {
    if (!price) return null
    const parsedPrice = parseUnits(price, globalConfig.ordersErc20.decimals)
    return {
      price: parsedPrice,
      validity,
    }
  }, [price, validity])

  const onSubmit = useCallback(async () => {
    if (!orderParams) return
    await sell({
      asset,
      ...orderParams,
    })
    onClose()
  }, [asset, onClose, orderParams, sell])

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <AssetHeaderImage asset={asset} />
      </div>

      <AssetFloorPriceLine asset={asset} />

      <div className="mt-4 flex w-full  flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-3 sm:w-2/3">
          <Label htmlFor="selling-price">
            Selling price in {globalConfig.ordersErc20.symbol}*
          </Label>
          <Input
            inputUpdateCallback={(inputValue) => setPrice(inputValue)}
            id="selling-price"
            placeholder="1.0"
            type="number"
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col gap-3 sm:w-1/3">
          <OrderExpirySelect setValidity={setValidity} defaultValidity={DEFAULT_VALIDITY} />
        </div>
      </div>

      <PriceDetails fullPrice={price} />

      <SwitchNetwork>
        <Button
          size="lg"
          className="flex w-full gap-1"
          onClick={onSubmit}
          disabled={isPending || !orderParams?.price}
          isLoading={isPending}
        >
          Sell for <Price amount={orderParams?.price} />
        </Button>
      </SwitchNetwork>
    </>
  )
}
