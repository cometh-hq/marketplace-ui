import { AssetWithTradeData } from "@cometh/marketplace-sdk"

import { AssetStatusBadge } from "@/components/marketplace/asset/asset-status-badge"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
  ProductBlockLabel
} from "@/components/product-block"

import { SellAssetButton } from "../buttons/sell"
import { BestOfferColumn } from "./columns/best-offer-column"
import { SwitchNetwork } from "../buttons/switch-network"
import { ConnectButton } from "@/components/connect-button"
import { UserLink } from "@/components/ui/user-button"
import { Address } from "viem"

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

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Owned by</ProductBlockLabel>
        <UserLink
          variant="link"
          className="mt-0.5"
          user={{ address: asset.owner as Address }}
        />
      </ProductBlockDividedColumn>

      <ProductBlockCenteredColumn>
        <ConnectButton>
          <SwitchNetwork>
            <SellAssetButton asset={asset} />
          </SwitchNetwork>
        </ConnectButton>
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}
