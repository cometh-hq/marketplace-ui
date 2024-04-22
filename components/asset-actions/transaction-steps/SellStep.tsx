import { useCallback, useMemo, useState } from "react"
import { useSellAsset } from "@/services/orders/sellAssetService"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import { parseEther } from "viem"
import { useAccount } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Price } from "@/components/ui/Price"
import { PriceDetails } from "@/components/ui/PriceDetails"
import { PriceInput } from "@/components/ui/PriceInput"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"
import TokenQuantityInput from "@/components/erc1155/TokenQuantityInput"
import { AssetHeaderImage } from "@/components/marketplace/asset/AssetHeaderImage"
import AssetFloorPriceLine from "@/components/marketplace/asset/floorPrice/AssetFloorPriceLine"
import { OrderExpirySelect } from "../buttons/OrderExpirySelect"

import { useAssetOwnershipByOwner } from "../../../services/cometh-marketplace/assetOwners"
import { SwitchNetwork } from "../buttons/SwitchNetwork"

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
  const account = useAccount()
  const currentUser = account?.address
  const { mutateAsync: sell, isPending } = useSellAsset(asset)
  const [unitPrice, setUnitPrice] = useState("")
  const [quantity, setQuantity] = useState(BigInt(1))
  const [validity, setValidity] = useState(DEFAULT_VALIDITY)
  const assetOwnership = useAssetOwnershipByOwner(
    asset.contractAddress,
    asset.tokenId,
    currentUser
  )
  const userOwnershipQuantity = assetOwnership.data?.quantity

  const isErc1155 = useAssetIs1155(asset)

  const parsedUnitPrice = useMemo(
    () =>
      unitPrice
        ? parseUnits(unitPrice, globalConfig.ordersErc20.decimals)
        : BigNumber.from(0),
    [unitPrice]
  )
  const totalPrice = useMemo(
    () => parsedUnitPrice.mul(quantity),
    [parsedUnitPrice, quantity]
  )

  const orderParams = useMemo(() => {
    return {
      price: totalPrice,
      quantity: quantity.toString(),
      validity,
    }
  }, [totalPrice, validity, quantity])

  const onSubmit = useCallback(async () => {
    if (!orderParams) return
    await sell({
      asset,
      ...orderParams,
    })
    setQuantity(BigInt(1))
    onClose()
  }, [asset, onClose, orderParams, sell])

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <AssetHeaderImage asset={asset} />
        <div>
          <h1 className="mt-2 text-2xl font-bold">{asset.metadata.name}</h1>
        </div>
      </div>

      <AssetFloorPriceLine asset={asset} />

      <div className="mt-4 flex w-full  flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-3 sm:w-2/3">
          <Label htmlFor="selling-price">
            {isErc1155 ? "Unit selling" : "Selling"} price in{" "}
            {globalConfig.ordersErc20.symbol}*
          </Label>
          <PriceInput
            onInputUpdate={(inputValue) => setUnitPrice(inputValue)}
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

      {isErc1155 && userOwnershipQuantity && (
        <TokenQuantityInput
          max={BigInt(userOwnershipQuantity)}
          label="Quantity to sell*"
          onChange={setQuantity}
          initialQuantity={BigInt(1)}
        />
      )}

      <PriceDetails
        isErc1155={isErc1155}
        quantity={quantity}
        unitPrice={parseEther(unitPrice)}
      />

      <SwitchNetwork>
        <Button
          size="lg"
          className="flex w-full gap-1"
          onClick={onSubmit}
          disabled={isPending || !orderParams?.price}
          isLoading={isPending}
        >
          <span>Sell</span>
          {isErc1155 && userOwnershipQuantity && (
            <span>{quantity.toString()}</span>
          )}
          for <Price amount={totalPrice.toString()} />
        </Button>
      </SwitchNetwork>
    </>
  )
}
