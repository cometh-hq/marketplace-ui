"use client"

import { BuyOffer } from "@/types/buy-offers"
import { TabsContent } from "@/components/ui/tabs"
import { AccountBuyOffersTable } from "@/components/activities/account/buy-offers-table"

export const SendBuyOffersTabContent = ({ offers }: { offers: BuyOffer[] }) => {
  return (
    <TabsContent value="sent-offers" className="w-full">
      <AccountBuyOffersTable offers={offers} />
    </TabsContent>
  )
}
