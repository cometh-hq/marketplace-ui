import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address, isAddressEqual } from "viem"
import { useAccount } from "wagmi"

import { BuyProductBlock } from "./BuyProductBlock"
import { NotListedProductBlock } from "./NotListedProductBlock"
import { SellProductBlock } from "./SellProductBlock"
import { ViewerListingProductBlock } from "./ViewerListingProductBlock"

export type ProductBlockProps = {
  asset: AssetWithTradeData
}

export function ProductBlock({ asset }: ProductBlockProps) {
  const account = useAccount()
  const viewerAddress = account.address
  const isOnSale = !!asset.orderbookStats.lowestListingPrice

  const viewerIsOwner =
    viewerAddress && isAddressEqual(asset.owner as Address, viewerAddress)
  const sellBlock = viewerIsOwner && !isOnSale
  const buyBlock = !viewerIsOwner && isOnSale
  const viewerListingBlock = viewerIsOwner && isOnSale

  if (sellBlock) return <SellProductBlock asset={asset} />
  if (buyBlock) return <BuyProductBlock asset={asset} />
  if (viewerListingBlock) return <ViewerListingProductBlock asset={asset} />

  return (
    <div className="flex flex-col gap-2">
      <NotListedProductBlock asset={asset} />
    </div>
  )
}
