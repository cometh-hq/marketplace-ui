"use client"

import { useAssetReceivedOffers } from "@/services/orders/assetOffersService"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { TabsContent } from "@/components/ui/Tabs"
import { BuyOffersTable } from "@/components/activities/asset-details/buy-offers-table/BuyOffersTable"

export type ActivitiesBuyOffersTabContentProps = {
  isErc1155?: boolean
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
  const isErc1155 = props.isErc1155 ?? false
  return (
    <TabsContent value="buy-offers" className="w-full">
      <BuyOffersTable offers={offers} isErc1155={isErc1155}  />
    </TabsContent>
  )
}
