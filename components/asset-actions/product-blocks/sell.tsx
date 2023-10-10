import { AssetWithTradeData } from "@alembic/nft-api-sdk"

import { AssetStatusBadge } from "@/components/marketplace/asset/asset-status-badge"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
} from "@/components/product-block"

// import { AuctionAssetButton } from "../buttons/auction"
import { SellAssetButton } from "../buttons/sell"
import { BestOfferColumn } from "./columns/best-offer-column"
import { SwitchNetwork } from "../buttons/switch-network"

export type SellProductBlockProps = {
  asset: AssetWithTradeData
}

export function SellProductBlock({ asset }: SellProductBlockProps) {
  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <AssetStatusBadge status="not-listed" />
        <span className="ml-2">-</span>
      </ProductBlockDividedColumn>

      <BestOfferColumn asset={asset} />
      <ProductBlockCenteredColumn>
        <SwitchNetwork>
          <SellAssetButton asset={asset} />
        </SwitchNetwork>
        {/* <Connected>
          <AuctionAssetButton asset={asset} />
          <SellAssetButton asset={asset} />
        </Connected> */}
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}
