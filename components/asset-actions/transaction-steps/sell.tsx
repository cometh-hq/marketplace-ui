import { useCallback, useMemo, useState } from "react"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { SwitchNetwork } from "../buttons/switch-network"
import { useSellAsset } from "@/services/orders/sell-asset"
import { parseUnits } from "ethers/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Price } from "@/components/ui/price"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AssetHeaderImage } from "@/components/marketplace/asset/image"

import globalConfig from "@/config/globalConfig"


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
  const [validity, setValidity] = useState("1")

  const orderParams = useMemo(() => {
    if (!price) return null
    const parsedPrice = parseUnits(price, 18)
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

      <div className="mt-4 flex w-full gap-4">
        <div className="flex flex-col gap-3 sm:w-2/3">
          <Label htmlFor="selling-price">
            Selling price in {globalConfig.ordersErc20.symbol}*
          </Label>
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            id="selling-price"
            placeholder="1.0"
            type="number"
          />
        </div>

        <div className="flex flex-col gap-3 sm:w-1/3">
          <Label htmlFor="make-buy-offer-price">Validity time</Label>
          <Select defaultValue="3" onValueChange={(v) => setValidity(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">24h</SelectItem>
              <SelectItem value="2">48h</SelectItem>
              <SelectItem value="3">72h</SelectItem>
              <SelectItem value="10">10 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SwitchNetwork>
        <Button
          className="flex w-full gap-1"
          size="lg"
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
