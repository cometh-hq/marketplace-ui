import { AssetWithTradeData, AssetTransfers } from "@cometh/marketplace-sdk"

import { Tabs } from "../../../ui/tabs"
import { TabBar } from "./tab-bar"
import { BuyOffersTabContent } from "./tabs-content/buy-offers"
import { ActivitiesTransfersTabContent } from "./tabs-content/transfers"
import { AssetMetadata } from "@/components/marketplace/asset/metadata"

export type AssetActivitiesProps = {
  asset: AssetWithTradeData
  assetTransfers: AssetTransfers
}

export const AssetActivities = ({
  asset,
  assetTransfers,
}: AssetActivitiesProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full lg:w-[55%]">
      <TabBar />
      <AssetMetadata asset={asset} />
      <ActivitiesTransfersTabContent assetTransfers={assetTransfers} />
      <BuyOffersTabContent asset={asset} />
    </Tabs>
  )
}
