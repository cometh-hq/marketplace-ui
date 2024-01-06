/**
 * This block is displayed when the viewer has
 * listed the asset for sale.
 */

import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { Price } from "@/components/ui/price"
import { UserLink } from "@/components/ui/user-button"
import { ConnectButton } from "@/components/connect-button"
import { AssetStatusBadge } from "@/components/marketplace/asset/asset-status-badge"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/product-block"

import { CancelListingButton } from "../buttons/cancel-listing"
import { SwitchNetwork } from "../buttons/switch-network"

export type SellProductBlockProps = {
  asset: AssetWithTradeData
}

export function ViewerListingProductBlock({ asset }: SellProductBlockProps) {
  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <AssetStatusBadge status="listed" />
        <Price amount={asset.orderbookStats.lowestSalePrice} />
      </ProductBlockDividedColumn>

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Best Offer</ProductBlockLabel>
        <Price amount={asset.orderbookStats.highestOfferPrice} />
      </ProductBlockDividedColumn>

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Listed by</ProductBlockLabel>
        <UserLink
          variant="link"
          className="mt-1"
          user={{ address: asset.owner as Address }}
        />
      </ProductBlockDividedColumn>

      <ProductBlockCenteredColumn>
        <ConnectButton fullVariant>
          <SwitchNetwork>
            <CancelListingButton asset={asset} />
          </SwitchNetwork>
        </ConnectButton>
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}
