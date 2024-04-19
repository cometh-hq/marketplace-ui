import {
  AssetTransfers,
  AssetWithTradeData,
  OrderWithAsset,
} from "@cometh/marketplace-sdk"

import { Tabs } from "@/components/ui/Tabs"
import { AssetMetadata } from "@/components/marketplace/asset/AssetMetadata"

import { TabBar } from "./TabBar"
import { ActivitiesTransfersTabContent } from "./tabs-content/ActivitiesTransfersTabContent"
import { BuyOffersTabContent } from "./tabs-content/BuyOffersTabContent"

export type AssetActivitiesProps = {
  asset: AssetWithTradeData
  assetTransfers: AssetTransfers
  assetOrders: OrderWithAsset[]
}

export const AssetActivities = ({
  asset,
  assetTransfers,
  assetOrders,
}: AssetActivitiesProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabBar />
      <AssetMetadata asset={asset} />
      <ActivitiesTransfersTabContent
        assetTransfers={assetTransfers}
        assetOrders={assetOrders}
      />
      <BuyOffersTabContent asset={asset} />
    </Tabs>
  )
}
