/**
 * This block is displayed when the viewer has
 * listed the asset for sale.
 */

import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { Price } from "@/components/ui/Price"
import { UserLink } from "@/components/ui/user/UserLink"
import { ConnectButton } from "@/components/ConnectButton"
import { AssetStatusBadge } from "@/components/marketplace/asset/AssetStatusBadge"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/ProductBlockContainer"

import { CancelListingButton } from "../buttons/CancelListingButton"
import { SwitchNetwork } from "../buttons/SwitchNetwork"

export type SellProductBlockProps = {
  asset: AssetWithTradeData
}

export function ViewerListingProductBlock({ asset }: SellProductBlockProps) {
  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <ProductBlockLabel>Price</ProductBlockLabel>
        <Price amount={asset.orderbookStats.lowestListingPrice} />
      </ProductBlockDividedColumn>

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Best Offer</ProductBlockLabel>
        <Price amount={asset.orderbookStats.highestOfferPrice} />
      </ProductBlockDividedColumn>

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Listed by</ProductBlockLabel>
        <UserLink
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
