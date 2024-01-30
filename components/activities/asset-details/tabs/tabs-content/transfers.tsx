"use client"

import { AssetTransfers, Order } from "@cometh/marketplace-sdk"

import { Card } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { TransfersList } from "@/components/transfers/list"

type ActivitiesTransfersTabContentProps = {
  assetTransfers: AssetTransfers
  assetOrders: Order[]
}

export const ActivitiesTransfersTabContent = ({
  assetTransfers,
  assetOrders
}: ActivitiesTransfersTabContentProps) => {
  return (
    <TabsContent value="activity">
      <Card>
        <TransfersList assetTransfers={assetTransfers} assetOrders={assetOrders} />
      </Card>
    </TabsContent>
  )
}
