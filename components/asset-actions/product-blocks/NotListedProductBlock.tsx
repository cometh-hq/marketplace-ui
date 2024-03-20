import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { UserLink } from "@/components/ui/user/UserLink"
import { AuthenticationButton } from "@/components/AuthenticationButton"
import { AssetStatusBadge } from "@/components/marketplace/asset/AssetStatusBadge"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/ProductBlockContainer"

import { MakeBuyOfferButton } from "../buttons/MakeBuyOfferPriceDialog"
import { SwitchNetwork } from "../buttons/SwitchNetwork"
import { BestOfferColumn } from "./columns/BestOfferColumn"

export type NotListedProductBlockProps = {
  asset: AssetWithTradeData
}

export function NotListedProductBlock({ asset }: NotListedProductBlockProps) {
  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <ProductBlockLabel>Price</ProductBlockLabel>
        <AssetStatusBadge status="not-listed" />
      </ProductBlockDividedColumn>

      <BestOfferColumn asset={asset} />

      {asset.owner && (
        <ProductBlockDividedColumn>
          <ProductBlockLabel>Owned by</ProductBlockLabel>
          <UserLink
            className="mt-0.5"
            user={{ address: asset.owner as Address }}
          />
        </ProductBlockDividedColumn>
      )}

      <ProductBlockCenteredColumn>
        <AuthenticationButton customText="Login to make an offer" fullVariant>
          <SwitchNetwork>
            <MakeBuyOfferButton asset={asset} />
          </SwitchNetwork>
        </AuthenticationButton>
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}
