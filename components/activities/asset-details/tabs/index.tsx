import {
  AssetTransfers,
  AssetWithTradeData,
  Order,
} from "@cometh/marketplace-sdk"

import { AssetMetadata } from "@/components/marketplace/asset/metadata"

import { Tabs } from "../../../ui/tabs"
import { TabBar } from "./tab-bar"
import { BuyOffersTabContent } from "./tabs-content/buy-offers"
import { ActivitiesTransfersTabContent } from "./tabs-content/transfers"

export type AssetActivitiesProps = {
  asset: AssetWithTradeData
  assetTransfers: AssetTransfers
  assetOrders: Order[]
}

export const AssetActivities = ({
  asset,
  assetTransfers,
  assetOrders,
}: AssetActivitiesProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full lg:w-[65%]">
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
