"use client"

import {
  AssetTransfers,
  OrderFilledEventWithAsset,
  OrderWithAsset,
} from "@cometh/marketplace-sdk"

import { Card } from "@/components/ui/Card"
import { TabsContent } from "@/components/ui/Tabs"
import { TradeActivitiesTable } from "@/components/trade-activities/TradeActivitiesTable"

type ActivitiesTransfersTabContentProps = {
  assetTransfers: AssetTransfers
  assetOrders: OrderWithAsset[]
  assetFilledEvents: OrderFilledEventWithAsset[]
  display1155Columns: boolean
}

export const AssetActivitiesTabsContent = ({
  assetTransfers,
  assetOrders,
  assetFilledEvents,
  display1155Columns,
}: ActivitiesTransfersTabContentProps) => {
  return (
    <TabsContent value="activity">
      <Card className="rounded-md">
        <TradeActivitiesTable
          assetTransfers={assetTransfers}
          orders={assetOrders}
          orderFilledEvents={assetFilledEvents}
          display1155Columns={display1155Columns}
          displayAssetColumns={false}
        />
      </Card>
    </TabsContent>
  )
}
