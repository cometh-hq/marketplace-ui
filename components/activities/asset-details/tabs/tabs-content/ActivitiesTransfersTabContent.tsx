"use client"

import { AssetTransfers, Order } from "@cometh/marketplace-sdk"

import { Card } from "@/components/ui/Card"
import { TabsContent } from "@/components/ui/Tabs"
import { TransfersList } from "@/components/transfers/TransfersList"

type ActivitiesTransfersTabContentProps = {
  assetTransfers: AssetTransfers
  assetOrders: Order[]
  display1155Columns: boolean
}

export const ActivitiesTransfersTabContent = ({
  assetTransfers,
  assetOrders,
  display1155Columns,
}: ActivitiesTransfersTabContentProps) => {
  return (
    <TabsContent value="activity">
      <Card>
        <TransfersList
          assetTransfers={assetTransfers}
          assetOrders={assetOrders}
          display1155Columns={display1155Columns}
        />
      </Card>
    </TabsContent>
  )
}
