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
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"

import { BuyOffersTable } from "./BuyOffersTable"

export type ActivitiesBuyOffersTabContentProps = {
  asset?: AssetWithTradeData
  maker?: Address
  owner?: Address
  tabKey?: string
}

export const BuyOffersTabContent = ({
  asset,
  maker,
  owner,
  tabKey = "buy-offers",
}: ActivitiesBuyOffersTabContentProps) => {
  const isErc1155 = useAssetIs1155(asset)

  const searchOffersParams = useMemo(() => {
    const searchOffersParams: SearchOrdersRequest = {
      direction: TradeDirection.BUY,
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
    if (owner) {
      searchOffersParams.assetOwner = owner
    }
    return searchOffersParams
  }, [asset, maker, owner])

  const { data: offersSearch, isPending } = useSearchOrders(searchOffersParams)
  const orders = offersSearch?.orders

  return (
    <TabsContent value={tabKey} className="w-full">
      {orders && !isPending ? (
        <BuyOffersTable
          offers={orders}
          isErc1155={isErc1155}
          isSpecificAsset={!!asset}
        />
      ) : (
        <div className="w-full p-4 text-center">Loading purchase offers...</div>
      )}
    </TabsContent>
  )
}
