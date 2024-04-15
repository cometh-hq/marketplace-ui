"use client"

import { OrderWithAsset } from "@cometh/marketplace-sdk"

import { TabsContent } from "@/components/ui/Tabs"
import { AccountBuyOffersTable } from "@/components/activities/account/buy-offers-table/AccountBuyOffersTable"

export const SendBuyOffersTabContent = ({
  offers,
}: {
  offers: OrderWithAsset[]
}) => {
  return (
    <TabsContent value="sent-offers" className="w-full">
      <AccountBuyOffersTable offers={offers} />
    </TabsContent>
  )
}
