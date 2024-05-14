import {
  AssetWithTradeData,
  OrderWithAsset,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"

import { Button } from "@/components/ui/Button"
import { PriceDetails } from "@/components/ui/PriceDetails"
import TokenQuantityInput from "@/components/erc1155/TokenQuantityInput"
import { AssetHeaderImage } from "@/components/marketplace/asset/AssetHeaderImage"

import { SwitchNetwork } from "../buttons/SwitchNetwork"
import { OrderAsset } from "@/types/assets"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"

export type QuantityStepProps = {
  asset: SearchAssetWithTradeData | AssetWithTradeData | OrderAsset
  order: OrderWithAsset
  quantity: bigint
  setQuantity: (quantity: bigint) => void
  onValid: () => void
}

export function BuyQuantityStep({
  asset,
  order,
  quantity,
  setQuantity,
  onValid,
}: QuantityStepProps) {
  const isErc1155 = useAssetIs1155(asset)
  return (
    <div className="flex flex-col items-center justify-center gap-[16px] pt-[16px]">
      <div className="flex w-full flex-col items-center justify-center">
        <AssetHeaderImage asset={asset} />
        <div>
          <h1 className="mt-2 text-2xl font-bold">{asset.metadata.name}</h1>
        </div>
      </div>

      <TokenQuantityInput
        max={BigInt(order.tokenQuantityRemaining)}
        label="Quantity to buy*"
        onChange={setQuantity}
        initialQuantity={BigInt(1)}
      />

      <PriceDetails
        unitPrice={BigInt(order.totalUnitPrice)}
        quantity={quantity}
        isReceiving={false}
        isErc1155={isErc1155}
      />

      <SwitchNetwork>
        <Button size="lg" className="flex gap-1" onClick={onValid}>
          Buy {quantity.toString()} NFTs
        </Button>
      </SwitchNetwork>
    </div>
  )
}
