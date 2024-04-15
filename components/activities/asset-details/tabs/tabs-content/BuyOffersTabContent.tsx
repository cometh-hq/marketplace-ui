"use client"

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
import { BuyOffersTable } from "@/components/activities/asset-details/buy-offers-table/BuyOffersTable"

export type ActivitiesBuyOffersTabContentProps = {
  isErc1155?: boolean
  asset?: AssetWithTradeData
  maker?: Address
}

export const BuyOffersTabContent = (
  props: ActivitiesBuyOffersTabContentProps
) => {
  const searchOffersParams: SearchOrdersRequest = {
    direction: TradeDirection.BUY,
    limit: 999,
    orderBy: SearchOrdersSortOption.SIGNED_AT,
    orderByDirection: FilterDirection.DESC,
  }
  if (props.asset) {
    searchOffersParams.tokenAddress = props.asset.contractAddress
    searchOffersParams.tokenIds = [props.asset.tokenId]
  }
  if (props.maker) {
    searchOffersParams.maker = props.maker
  }

  const { data: offersSearch, isPending } = useSearchOrders(searchOffersParams)
  const orders = offersSearch?.orders
  const isErc1155 = props.isErc1155 ?? false

  return (
    <TabsContent value="buy-offers" className="w-full">
      {orders && !isPending ? (
        <BuyOffersTable offers={orders} isErc1155={isErc1155} />
      ) : (
        <div className="w-full p-4 text-center">Loading purchase offers...</div>
      )}
    </TabsContent>
  )
}
