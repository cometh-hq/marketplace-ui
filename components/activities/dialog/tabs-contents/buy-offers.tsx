"use client"

import { useAssetReceivedOffers } from "@/services/orders/asset-buy-offers"
import { AssetWithTradeData } from "@alembic/nft-api-sdk"
import { Row } from "@tanstack/react-table"
import { Address } from "viem"

import { BuyOffer } from "@/types/buy-offers"
import { TabsContent } from "@/components/ui/tabs"
import { BuyOffersTable } from "@/components/activities/buy-offers-table"

export type ActivitiesBuyOffersTabContentProps = {
  highlight?: Row<BuyOffer>["id"]
} & (
  | {
      asset: AssetWithTradeData
    }
  | {
      maker: Address
    }
)

export const BuyOffersTabContent = (
  props: ActivitiesBuyOffersTabContentProps
) => {
  const offers = useAssetReceivedOffers(props)

  return (
    <TabsContent value="buy-offers" className="w-full">
      <BuyOffersTable highlight={props.highlight} offers={offers} />
    </TabsContent>
  )
}
