import { AssetWithTradeData } from '@cometh/marketplace-sdk'
import { Address } from "viem"

import { Price } from "@/components/ui/price"
import { UserLink } from "@/components/ui/user-button"
import { Connected } from "@/components/connected"
import { AssetStatusBadge } from "@/components/marketplace/asset/asset-status-badge"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/product-block"

import { BuyAssetButton } from "../buttons/buy"
import { MakeBuyOfferButton } from "../buttons/make-buy-offer"
import { BestOfferColumn } from "./columns/best-offer-column"
import { SwitchNetwork } from "../buttons/switch-network"

export type BuyProductBlockProps = {
  asset: AssetWithTradeData
}

export function BuyProductBlock({ asset }: BuyProductBlockProps) {
  // const listing = asset.listings?.[0]
  const listingPrice = asset.orderbookStats.lowestSalePrice
  // if (!listing) return null

  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <AssetStatusBadge status="listed" />
        <Price amount={listingPrice} size="xl" />
      </ProductBlockDividedColumn>

      <BestOfferColumn asset={asset} />

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Listed by</ProductBlockLabel>
        <UserLink
          variant="link"
          className="mt-1"
          user={{ address: asset.owner as Address }}
        />
      </ProductBlockDividedColumn>
      <ProductBlockCenteredColumn>
        <Connected>
          <SwitchNetwork>
            <MakeBuyOfferButton asset={asset} />
            <BuyAssetButton asset={asset} />
          </SwitchNetwork>
        </Connected>
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}