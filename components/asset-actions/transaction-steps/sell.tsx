import { useCallback, useMemo, useState } from "react"
import { useSellAsset } from "@/services/orders/sell-asset"
import { AssetWithTradeData } from "@alembic/nft-api-sdk"
import { parseUnits } from "ethers/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Price } from "@/components/ui/price"
import { AssetHeaderImage } from "@/components/marketplace/asset/image"
import { SwitchNetwork } from "../buttons/switch-network"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
      return { price: parsedPrice, validity}
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
  }, [asset, bnPrice, onValid, sell])

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <AssetHeaderImage asset={asset} />
      </div>

      <div className="w-full flex gap-4 mt-4">
        <div className="flex flex-col gap-3 md:w-2/3">
          <Label htmlFor="selling-price">Selling price</Label>
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            id="selling-price"
            placeholder="1.0"
            type="number"
          />
        </div>

        <div className="flex flex-col gap-3 md:w-1/3">
          <Label htmlFor="make-buy-offer-price">Validity time</Label>
          <Select onValueChange={(v) => setValidity(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent >
              <SelectItem value="1">24h</SelectItem>
              <SelectItem value="2">48h</SelectItem>
              <SelectItem value="3">72h</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SwitchNetwork
        callbackChildren={
          <Button className="mt-4 flex gap-1 w-full" size="lg" disabled>
            Sell for <Price amount={bnPrice?.price} />
          </Button>
        }
      >
        <Button className="mt-4 flex gap-1 w-full" size="lg" onClick={onSubmit}>
          Sell for <Price amount={bnPrice?.price} />
        </Button>
      </SwitchNetwork>
    </>
  )
}