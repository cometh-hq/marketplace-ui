import { useUsername } from "@/services/user/use-username"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
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

import { SellAssetButton } from "../buttons/sell"
import { SwitchNetwork } from "../buttons/switch-network"
import { BestOfferColumn } from "./columns/best-offer-column"

export type SellProductBlockProps = {
  asset: AssetWithTradeData
}

export function SellProductBlock({ asset }: SellProductBlockProps) {
  const { username, isFetchingUsername } = useUsername(asset.owner as Address)

  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <AssetStatusBadge status="not-listed" />
        <span className="ml-2">-</span>
      </ProductBlockDividedColumn>

      <BestOfferColumn asset={asset} />

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Owned by</ProductBlockLabel>
        {!isFetchingUsername && (
          <UserLink
            variant="link"
            className="mt-0.5"
            user={{ address: asset.owner as Address, username: username }}
          />
        )}
      </ProductBlockDividedColumn>

      <ProductBlockCenteredColumn>
        <ConnectButton fullVariant>
          <SwitchNetwork>
            <SellAssetButton asset={asset} />
          </SwitchNetwork>
        </ConnectButton>
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}
