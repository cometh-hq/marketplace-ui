import { useEffect } from "react"
import {
  AssetOwners,
  AssetTransfers,
  AssetWithTradeData,
  Order,
  OrderFilledEventWithAsset,
  OrderWithAsset,
} from "@cometh/marketplace-sdk"

import { Tabs } from "@/components/ui/Tabs"
import { AssetOwnersTableTab } from "@/components/erc1155/assetOwnersTable/AssetOwnersTable"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"
import { AssetMetadata } from "@/components/marketplace/asset/AssetMetadata"

import { ListingsTabContent } from "../../order-tables/listings/ListingsTabContent"
import { BuyOffersTabContent } from "../../order-tables/offers/BuyOffersTabContent"
import { AssetDetailsTabBar } from "./AssetDetailsTabBar"
import { useQueryParamTab } from "./pageTabHooks"
import { ActivitiesTransfersTabContent } from "./tabs-content/ActivitiesTransfersTabContent"

export type AssetActivitiesProps = {
  asset: AssetWithTradeData
  assetTransfers: AssetTransfers
  assetOwners: AssetOwners
  assetOrders: OrderWithAsset[]
  assetFilledEvents: OrderFilledEventWithAsset[]
}

export const AssetDetailsTabs = ({
  asset,
  assetTransfers,
  assetOrders,
  assetFilledEvents,
  assetOwners,
}: AssetActivitiesProps) => {
  const isErc1155 = useAssetIs1155(asset)
  const [currentTab, setCurrentTab] = useQueryParamTab("overview")

  return (
    <Tabs
      id="tabs"
      value={currentTab}
      onValueChange={setCurrentTab}
      className="mb-4 w-full"
    >
      <AssetDetailsTabBar isErc1155={isErc1155} />
      <AssetMetadata asset={asset} />
      <ActivitiesTransfersTabContent
        assetTransfers={assetTransfers}
        assetOrders={assetOrders}
        assetFilledEvents={assetFilledEvents}
        display1155Columns={isErc1155}
      />
      <ListingsTabContent asset={asset} />

      {isErc1155 && (
        <>
          <BuyOffersTabContent asset={asset} />
          <AssetOwnersTableTab owners={assetOwners} />
        </>
      )}
    </Tabs>
  )
}
