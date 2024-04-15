"use client"

import { TabsContent } from "@/components/ui/Tabs"
import { AccountBuyOffersTable } from "@/components/activities/account/buy-offers-table/AccountBuyOffersTable"
import { OrderWithAsset } from "@cometh/marketplace-sdk"

export const BuyOffersTabContent = ({ offers }: { offers: OrderWithAsset[] }) => {
  return (
    <TabsContent value="received-offers" className="w-full">
      <AccountBuyOffersTable offers={offers} />
    </TabsContent>
  )
}
