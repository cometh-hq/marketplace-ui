import { AssetWithTradeData } from "@alembic/nft-api-sdk"
import { Address } from "viem"

import { UserLink } from "@/components/ui/user-button"
import { ConnectButton } from "@/components/connect-button"
import { AssetStatusBadge } from "@/components/marketplace/asset/asset-status-badge"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/product-block"

import { MakeBuyOfferButton } from "../buttons/make-buy-offer"
import { BestOfferColumn } from "./columns/best-offer-column"
import { SwitchNetwork } from "../buttons/switch-network"

export type NotListedProductBlockProps = {
  asset: AssetWithTradeData
}

export function NotListedProductBlock({ asset }: NotListedProductBlockProps) {
  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <AssetStatusBadge status="not-listed" />-
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
        <SwitchNetwork>
          <MakeBuyOfferButton asset={asset} />
        </SwitchNetwork>
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}
