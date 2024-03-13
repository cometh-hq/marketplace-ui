/**
 * This block is displayed when the viewer has
 * listed the asset for sale.
 */

import { useUsername } from "@/services/user/use-username"
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
  const { username, isFetchingUsername } = useUsername(asset.owner as Address)

  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <ProductBlockLabel>Price</ProductBlockLabel>
        <Price size="lg" amount={asset.orderbookStats.lowestListingPrice} isNativeToken={true} />
      </ProductBlockDividedColumn>

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Best Offer</ProductBlockLabel>
        <Price size="lg" amount={asset.orderbookStats.highestOfferPrice} isNativeToken={true} />
      </ProductBlockDividedColumn>

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Listed by</ProductBlockLabel>
        {!isFetchingUsername && (
          <UserLink
            variant="link"
            className="mt-1"
            user={{ address: asset.owner as Address, username: username }}
          />
        )}
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
