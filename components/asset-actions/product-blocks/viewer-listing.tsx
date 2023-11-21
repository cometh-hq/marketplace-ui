/**
 * This block is displayed when the viewer has
 * listed the asset for sale.
 */

import { AssetWithTradeData } from '@cometh/marketplace-sdk'

import { Price } from "@/components/ui/price"
import { Connected } from "@/components/connected"
import { AssetStatusBadge } from "@/components/marketplace/asset/asset-status-badge"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/product-block"

import { CancelListingButton } from "../buttons/cancel-listing"

export type SellProductBlockProps = {
  asset: AssetWithTradeData
}

export function ViewerListingProductBlock({ asset }: SellProductBlockProps) {
  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <AssetStatusBadge status="listed" />
        <Price amount={asset.orderbookStats.lowestSalePrice} size="xl" />
      </ProductBlockDividedColumn>

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Best Offer</ProductBlockLabel>
        <Price amount={asset.orderbookStats.highestOfferPrice} size="xl" />
      </ProductBlockDividedColumn>

      <Connected>
        <ProductBlockCenteredColumn>
          <CancelListingButton asset={asset} />
        </ProductBlockCenteredColumn>
      </Connected>
    </ProductBlockContainer>
  )
}
