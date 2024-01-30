"use client"

import { useAssetDetails } from "@/services/cometh-marketplace/search-assets"
import { useSearchOrders } from "@/services/cometh-marketplace/search-orders"
import { useAssetTransfers } from "@/services/cometh-marketplace/transfers"
import {
  FilterDirection,
  SearchOrdersSortOption,
  TradeStatus,
} from "@cometh/marketplace-sdk"

import globalConfig from "@/config/globalConfig"
import { Loading } from "@/components/ui/loading"
import { AssetActivities } from "@/components/activities/asset-details/tabs"
import AssetDetails from "@/components/marketplace/asset/header"
import { AssetHeaderImage } from "@/components/marketplace/asset/image"

export default function DetailsPage({
  params,
}: {
  params: { assetId: string }
}) {
  const { assetId } = params
  const { data: asset } = useAssetDetails(globalConfig.contractAddress, assetId)
  const { data: assetTransfers } = useAssetTransfers(
    globalConfig.contractAddress,
    assetId
  )
  const { data: assetOrders } = useSearchOrders({
    tokenAddress: globalConfig.contractAddress,
    tokenIds: [assetId],
    statuses: [TradeStatus.FILLED, TradeStatus.OPEN],
    orderBy: SearchOrdersSortOption.UPDATED_AT,
    orderByDirection: FilterDirection.DESC,
    limit: 100,
  })

  const loading = !asset || !assetTransfers || !assetOrders

  return (
    <div className="container py-10">
      {loading && <Loading />}
      {!loading && (
        <div className="flex w-full flex-col flex-wrap gap-6 md:gap-12 lg:flex-row lg:items-center">
          <AssetHeaderImage asset={asset} />
          <AssetDetails asset={asset} />
          {assetTransfers && (
            <AssetActivities
              asset={asset}
              assetOrders={assetOrders?.orders}
              assetTransfers={assetTransfers}
            />
          )}
        </div>
      )}
    </div>
  )
}
