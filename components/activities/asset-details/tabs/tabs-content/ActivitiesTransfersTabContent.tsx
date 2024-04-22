"use client"

import { AssetTransfers, OrderWithAsset } from "@cometh/marketplace-sdk"

import { Card } from "@/components/ui/Card"
import { TabsContent } from "@/components/ui/Tabs"
import { TradeActivitiesTable } from "@/components/trade-activities/TradeActivitiesTable"

type ActivitiesTransfersTabContentProps = {
  assetTransfers: AssetTransfers
  assetOrders: OrderWithAsset[]
  display1155Columns: boolean
}

export const ActivitiesTransfersTabContent = ({
  assetTransfers,
  assetOrders,
  display1155Columns,
}: ActivitiesTransfersTabContentProps) => {
  return (
    <TabsContent value="activity">
      <Card className="rounded-md">
        <TradeActivitiesTable
          assetTransfers={assetTransfers}
          orders={assetOrders}
          display1155Columns={display1155Columns}
          displayAssetColumns={false}
        />
      </Card>
    </TabsContent>
  )
}
