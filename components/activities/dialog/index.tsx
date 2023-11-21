import { AssetWithTradeData, AssetTransfers } from '@cometh/marketplace-sdk'

import { Tabs } from "../../ui/tabs"
import { ActivitiesTabBar } from "./tab-bar"
import { BuyOffersTabContent } from "./tabs-contents/buy-offers"
import { ActivitiesTransfersTabContent } from "./tabs-contents/transfers"
import { AssetMetadata } from "@/components/marketplace/asset/metadata"

export type AssetActivitiesDialogProps = {
  asset: AssetWithTradeData
  assetTransfers: AssetTransfers
}

export const AssetActivitiesDialog = ({
  asset,
  assetTransfers,
}: AssetActivitiesDialogProps) => {
  return (
    <Tabs defaultValue="buy-offers" className="lg:w-[55%]">
      <ActivitiesTabBar />
      <AssetMetadata asset={asset} />
      <ActivitiesTransfersTabContent assetTransfers={assetTransfers} />
      <BuyOffersTabContent asset={asset} />
    </Tabs>
  )
}
