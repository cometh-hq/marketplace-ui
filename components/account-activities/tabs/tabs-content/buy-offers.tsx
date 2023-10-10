"use client"

import { TabsContent } from "@/components/ui/tabs"
import { AccountBuyOffersTable } from "@/components/account-activities/offers-table"
import { BuyOffer } from "@/types/buy-offers"

export const BuyOffersTabContent = ({
  offers
}: {
  offers: BuyOffer[]
}) => {
  return (
    <TabsContent value="received-offers" className="w-full" aria-controls="radix-:Rirbb9ipj9:">
      <AccountBuyOffersTable offers={offers} />
    </TabsContent>
  )
}