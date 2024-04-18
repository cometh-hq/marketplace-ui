"use client"

import { useMemo } from "react"
import { useSearchOrders } from "@/services/cometh-marketplace/searchOrdersService"
import {
  AssetWithTradeData,
  FilterDirection,
  SearchOrdersRequest,
  SearchOrdersSortOption,
  TradeDirection,
} from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { TabsContent } from "@/components/ui/Tabs"
import { ListingTable } from "@/components/activities/order-tables/listings/ListingTable"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"

export type ActivitiesListingsTabContentProps = {
  asset?: AssetWithTradeData
  maker?: Address
}

export const ListingsTabContent = ({
  asset,
  maker,
}: ActivitiesListingsTabContentProps) => {
  const isErc1155 = useAssetIs1155(asset)

  const searchOffersParams = useMemo(() => {
    const searchOffersParams: SearchOrdersRequest = {
      direction: TradeDirection.SELL,
      limit: 999,
      orderBy: SearchOrdersSortOption.SIGNED_AT,
      orderByDirection: FilterDirection.DESC,
    }
    if (asset) {
      searchOffersParams.tokenAddress = asset.contractAddress
      searchOffersParams.tokenIds = [asset.tokenId]
    }
    if (maker) {
      searchOffersParams.maker = maker
    }
    return searchOffersParams
  }, [asset, maker])

  const { data: offersSearch, isPending } = useSearchOrders(searchOffersParams)
  const orders = offersSearch?.orders
  const isSpecificAsset = !!asset
  return (
    <TabsContent value="listings" className="w-full">
      {orders && !isPending ? (
        <ListingTable
          listings={orders}
          isErc1155={!isSpecificAsset || isErc1155}
          isSpecificAsset={isSpecificAsset}
        />
      ) : (
        <div className="w-full p-4 text-center">Loading listings...</div>
      )}
    </TabsContent>
  )
}
