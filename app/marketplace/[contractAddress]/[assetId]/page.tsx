"use client"

import { useAssetDetails } from "@/services/cometh-marketplace/searchAssetsService"
import { useSearchOrders } from "@/services/cometh-marketplace/searchOrdersService"
import { useAssetTransfers } from "@/services/cometh-marketplace/assetTransfersService"
import {
  FilterDirection,
  SearchOrdersSortOption,
  TradeStatus,
} from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { Loading } from "@/components/ui/Loading"
import { AssetActivities } from "@/components/activities/asset-details/tabs/AssetActivities"
import AssetDetails from "@/components/marketplace/asset/AssetDetails"
import { AssetHeaderImage } from "@/components/marketplace/asset/AssetHeaderImage"

export default function DetailsPage({
  params,
}: {
  params: { contractAddress: Address; assetId: string }
}) {
  const { assetId, contractAddress } = params
  const { data: asset } = useAssetDetails(contractAddress, assetId)
  const { data: assetTransfers } = useAssetTransfers(contractAddress, assetId)
  const { data: assetOrders } = useSearchOrders({
    tokenAddress: contractAddress,
    tokenIds: [assetId],
    statuses: [TradeStatus.FILLED, TradeStatus.OPEN],
    orderBy: SearchOrdersSortOption.UPDATED_AT,
    orderByDirection: FilterDirection.DESC,
    limit: 100,
  })

  const loading = !asset || !assetTransfers || !assetOrders

  return (
    <div className="container py-6">
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
