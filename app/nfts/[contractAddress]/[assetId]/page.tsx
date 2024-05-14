"use client"

import { useAssetOwners } from "@/services/cometh-marketplace/assetOwners"
import { useAssetTransfers } from "@/services/cometh-marketplace/assetTransfersService"
import { useAssetDetails } from "@/services/cometh-marketplace/searchAssetsService"
import { useSearchFilledEvents } from "@/services/cometh-marketplace/searchFilledEventsService"
import { useSearchOrders } from "@/services/cometh-marketplace/searchOrdersService"
import {
  FilterDirection,
  SearchOrdersSortOption,
  TradeStatus,
} from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { Loading } from "@/components/ui/Loading"
import { AssetDetailsTabs } from "@/components/activities/asset-details/tabs/AssetDetailsTabs"
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
  const { data: assetOwners } = useAssetOwners(contractAddress, assetId)
  const { data: assetOrdersSearch } = useSearchOrders({
    tokenAddress: contractAddress,
    tokenIds: [assetId],
    statuses: [TradeStatus.OPEN],
    orderBy: SearchOrdersSortOption.UPDATED_AT,
    orderByDirection: FilterDirection.DESC,
    limit: 100,
  })
  const { data: assetFilledEventsSearch } = useSearchFilledEvents({
    tokenAddress: contractAddress,
    tokenIds: [assetId],
    limit: 100,
  })

  const loading =
    !asset ||
    !assetTransfers ||
    !assetOrdersSearch ||
    !assetOwners ||
    !assetFilledEventsSearch

  return (
    <div className="container py-6">
      {loading && <Loading />}
      {!loading && (
        <div className="flex w-full flex-col flex-wrap gap-6 md:gap-12 lg:flex-row lg:items-center">
          <AssetHeaderImage asset={asset} />
          <AssetDetails asset={asset} />
          {assetTransfers && assetOwners && (
            <AssetDetailsTabs
              asset={asset}
              assetOrders={assetOrdersSearch?.orders}
              assetFilledEvents={assetFilledEventsSearch?.filledEvents}
              assetTransfers={assetTransfers}
              assetOwners={assetOwners}
            />
          )}
        </div>
      )}
    </div>
  )
}
