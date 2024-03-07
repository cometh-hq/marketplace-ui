import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address, isAddressEqual } from "viem"

import { useCurrentViewerAddress } from "@/lib/web3/auth"

import { BuyProductBlock } from "./buy"
import { NotListedProductBlock } from "./not-listed"
import { SellProductBlock } from "./sell"
import { ViewerListingProductBlock } from "./viewer-listing"

export type ProductBlockProps = {
  asset: AssetWithTradeData
}

export function ProductBlock({ asset }: ProductBlockProps) {
  const viewerAddress = useCurrentViewerAddress()
  const isOnSale = !!asset.orderbookStats.lowestListingPrice
  // const isListed = !!asset.highestOfferPrice

  const viewerIsOwner =
    viewerAddress && isAddressEqual(asset.owner as Address, viewerAddress)
  const sellBlock = viewerIsOwner && !isOnSale
  const buyBlock = !viewerIsOwner && isOnSale
  const viewerListingBlock = viewerIsOwner && isOnSale

  if (sellBlock) return <SellProductBlock asset={asset} />
  if (buyBlock) return <BuyProductBlock asset={asset} />
  if (viewerListingBlock) return <ViewerListingProductBlock asset={asset} />

  return <div className="flex flex-col gap-2">
    <NotListedProductBlock asset={asset} />
  </div>
}
