"use client"

import { Tabs } from "../../ui/tabs"
import { AssetsSearchTabContent } from "./tabs-content/assets-search"
import { BuyOffersTabContent } from "./tabs-content/buy-offers"
import { ActivitiesTabBar } from "./tab-bar"
import { SendBuyOffersTabContent } from "./tabs-content/send-offers"
import { useAccountReceivedOffers, useAssetSentOffers } from "@/services/orders/asset-buy-offers"
import { Address } from "viem"

export type AccountAssetActivitiesProps = {
  walletAddress: Address
  children?: React.ReactNode
}

export const AccountAssetActivities = ({
  walletAddress,
  children,
}: AccountAssetActivitiesProps) => {
  const receivedOffers = useAccountReceivedOffers({ owner: walletAddress })
  const sentOffers = useAssetSentOffers({ owner: walletAddress })

  return (
    <Tabs defaultValue="search-assets" className="w-full">
      <ActivitiesTabBar receivedCounter={receivedOffers.length} sentCounter={sentOffers.length} />
      <AssetsSearchTabContent>{children}</AssetsSearchTabContent>
      <BuyOffersTabContent offers={receivedOffers} />
      <SendBuyOffersTabContent offers={sentOffers} />
    </Tabs>
  )
}
