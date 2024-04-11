import {
  AssetOwners,
  AssetTransfers,
  AssetWithTradeData,
  Order,
} from "@cometh/marketplace-sdk"

import { Tabs } from "@/components/ui/Tabs"
import { AssetOwnersTableTab } from "@/components/erc1155/assetOwnersTable/AssetOwnersTable"
import { AssetMetadata } from "@/components/marketplace/asset/AssetMetadata"

import { TabBar } from "./TabBar"
import { ActivitiesTransfersTabContent } from "./tabs-content/ActivitiesTransfersTabContent"
import { BuyOffersTabContent } from "./tabs-content/BuyOffersTabContent"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"

export type AssetActivitiesProps = {
  asset: AssetWithTradeData
  assetTransfers: AssetTransfers
  assetOwners: AssetOwners
  assetOrders: Order[]
}

export const AssetDetailsTabs = ({
  asset,
  assetTransfers,
  assetOrders,
  assetOwners,
}: AssetActivitiesProps) => {
  const isErc1155 = useAssetIs1155(asset)
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabBar isErc1155={isErc1155} />
      <AssetMetadata asset={asset} />
      <ActivitiesTransfersTabContent
        assetTransfers={assetTransfers}
        assetOrders={assetOrders}
      />
      <BuyOffersTabContent isErc1155={isErc1155} asset={asset} />
      {isErc1155 && <AssetOwnersTableTab owners={assetOwners} />}
    </Tabs>
  )
}
