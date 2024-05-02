import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { Price } from "@/components/ui/Price"
import { UserLink } from "@/components/ui/user/UserLink"
import { AuthenticationButton } from "@/components/login/AuthenticationButton"
import { AssetStatusBadge } from "@/components/marketplace/asset/AssetStatusBadge"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/ProductBlockContainer"

import { BuyAssetButton } from "../buttons/BuyAssetButton"
import { MakeBuyOfferButton } from "../buttons/MakeBuyOfferPriceDialog"
import { SwitchNetwork } from "../buttons/SwitchNetwork"
import { BestOfferColumn } from "./columns/BestOfferColumn"

export type BuyProductBlockProps = {
  asset: AssetWithTradeData
}

export function BuyProductBlock({ asset }: BuyProductBlockProps) {
  const listingPrice = asset.orderbookStats.lowestListingPrice

  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <ProductBlockLabel>Price</ProductBlockLabel>
        <Price size="lg" amount={listingPrice} shouldDisplayFiatPrice={true} />
      </ProductBlockDividedColumn>

      <BestOfferColumn asset={asset} />

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Listed by</ProductBlockLabel>
        <UserLink className="mt-1" user={{ address: asset.owner as Address }} />
      </ProductBlockDividedColumn>
      <ProductBlockCenteredColumn>
        <AuthenticationButton fullVariant customText="Login to buy">
          <SwitchNetwork>
            <BuyAssetButton asset={asset} />
            <MakeBuyOfferButton variant="secondary" asset={asset} />
          </SwitchNetwork>
        </AuthenticationButton>
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}
