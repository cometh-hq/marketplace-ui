import { useCallback, useMemo, useState } from "react"
import { useSellAsset } from "@/services/orders/sell-asset"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
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

import { SwitchNetwork } from "../buttons/switch-network"

export type SellStepProps = {
  asset: AssetWithTradeData
  onValid: () => void
}

/**
 * Arriving at this stage means that the user has approved the collection
 * so we don't have to do any check here
 *
 * TODO: wrap in a form
 */
export function SellStep({ asset, onValid }: SellStepProps) {
  const { mutateAsync: sell, isLoading, isError } = useSellAsset()
  const [price, setPrice] = useState("")
  const [validity, setValidity] = useState("")

  const bnPrice = useMemo(() => {
    try {
      const parsedPrice = parseUnits(price, 18)
      console.log("price in SellStep", price)
      console.log("parsedPrice in SellStep", parsedPrice)
      return { price: parsedPrice, validity }
    } catch (e) {
      return null
    }
  }, [price, validity])

  const onSubmit = useCallback(async () => {
    if (!bnPrice || !validity) return
    await sell({
      asset,
      ...bnPrice,
    })
    if (!isError) onValid()
  }, [asset, bnPrice, onValid])

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <AssetHeaderImage asset={asset} />
      </div>

      <div className="mt-4 flex w-full gap-4">
        <div className="flex flex-col gap-3 sm:w-2/3">
          <Label htmlFor="selling-price">Selling price</Label>
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
          <Select onValueChange={(v) => setValidity(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">24h</SelectItem>
              <SelectItem value="2">48h</SelectItem>
              <SelectItem value="3">72h</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SwitchNetwork>
        <Button
          className="flex w-full gap-1"
          size="lg"
          onClick={onSubmit}
          disabled={isLoading}
          isLoading={isLoading}
        >
          Sell for <Price amount={bnPrice?.price} />
        </Button>
      </SwitchNetwork>
    </>
  )
}
