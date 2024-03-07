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

import { BuyAssetButton } from "../buttons/buy"
import { MakeBuyOfferButton } from "../buttons/make-buy-offer"
import { SwitchNetwork } from "../buttons/switch-network"
import { BestOfferColumn } from "./columns/best-offer-column"

export type BuyProductBlockProps = {
  asset: AssetWithTradeData
}

export function BuyProductBlock({ asset }: BuyProductBlockProps) {
  const listingPrice = asset.orderbookStats.lowestListingPrice

  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <ProductBlockLabel>Price</ProductBlockLabel>
        <Price amount={listingPrice} shouldDisplayFiatPrice={true}/>
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
        <ConnectButton fullVariant customText="Login to buy">
          <SwitchNetwork>
            <BuyAssetButton asset={asset} />
            <MakeBuyOfferButton variant="secondary" asset={asset} />
          </SwitchNetwork>
        </ConnectButton>
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}
