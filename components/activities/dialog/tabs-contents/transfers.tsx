"use client"

import { AssetTransfers } from "@alembic/nft-api-sdk"

import { Card } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { TransfersList } from "@/components/transfers/list"

type ActivitiesTransfersTabContentProps = {
  assetTransfers: AssetTransfers
}

export const ActivitiesTransfersTabContent = ({
  assetTransfers,
}: ActivitiesTransfersTabContentProps) => {
  return (
    <TabsContent value="transfers">
      <Card>
        <TransfersList assetTransfers={assetTransfers} />
      </Card>
    </TabsContent>
  )
}
