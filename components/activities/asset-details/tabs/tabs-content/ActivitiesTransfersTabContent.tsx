"use client"

import { AssetTransfers, OrderWithAsset } from "@cometh/marketplace-sdk"

import { Card } from "@/components/ui/Card"
import { TabsContent } from "@/components/ui/Tabs"
import { TradeActivitiesTable } from "@/components/trade-activities/TradeActivitiesTable"

type ActivitiesTransfersTabContentProps = {
  assetTransfers: AssetTransfers
  assetOrders: OrderWithAsset[]
}

export const ActivitiesTransfersTabContent = ({
  assetTransfers,
  assetOrders,
}: ActivitiesTransfersTabContentProps) => {
  return (
    <TabsContent value="activity">
      <Card className="rounded-md">
        <TradeActivitiesTable
          assetTransfers={assetTransfers}
          orders={assetOrders}
          display1155Columns={false}
          displayAssetColumns={false}
        />
      </Card>
    </TabsContent>
  )
}
