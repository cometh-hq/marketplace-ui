import { useCallback, useMemo, useState } from "react"
import { useSellAsset } from "@/services/orders/sell-asset"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { parseUnits } from "ethers/lib/utils"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Price } from "@/components/ui/price"
import { PriceDetails } from "@/components/ui/priceDetails"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AssetHeaderImage } from "@/components/marketplace/asset/image"

import { SwitchNetwork } from "../buttons/switch-network"

export type SellStepProps = {
  asset: AssetWithTradeData
  onClose: () => void
}

/**
 * Arriving at this stage means that the user has approved the collection
 * so we don't have to do any check here
 *
 * TODO: wrap in a form
 */
export function SellStep({ asset, onClose }: SellStepProps) {
  const { mutateAsync: sell, isPending } = useSellAsset()
  const [price, setPrice] = useState("")
  const [validity, setValidity] = useState("10")

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

      <div className="mt-4 flex w-full  flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-3 sm:w-2/3">
          <Label htmlFor="selling-price">
            Selling price in {globalConfig.ordersDisplayCurrency.symbol}*
          </Label>
          <Input
            onInputUpdate={(inputValue) => setPrice(inputValue)}
            id="selling-price"
            placeholder="1.0"
            type="number"
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col gap-3 sm:w-auto">
          <Label htmlFor="make-buy-offer-price">Validity time</Label>
          <Select defaultValue="10" onValueChange={(v) => setValidity(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="10">10 days</SelectItem>
            <SelectItem value="20">30 days</SelectItem>
            <SelectItem value="30">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <PriceDetails fullPrice={price} />

      <SwitchNetwork>
        <Button
          className="flex w-full gap-1"
          size="lg"
          onClick={onSubmit}
          disabled={isPending || !orderParams?.price}
          isLoading={isPending}
        >
          Sell for <Price amount={orderParams?.price} isNativeToken={true} />
        </Button>
      </SwitchNetwork>
    </>
  )
}
