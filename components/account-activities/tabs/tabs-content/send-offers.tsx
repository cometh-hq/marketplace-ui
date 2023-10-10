"use client"

import { TabsContent } from "@/components/ui/tabs"
import { AccountBuyOffersTable } from "@/components/account-activities/offers-table"
import { BuyOffer } from "@/types/buy-offers"

export const SendBuyOffersTabContent = ({
  offers
}: {
  offers: BuyOffer[]
}) => {
  return (
    <TabsContent value="sent-offers" className="w-full" aria-controls="radix-:Rirbb9ipj9:">
      <AccountBuyOffersTable offers={offers} />
    </TabsContent>
  )
}
