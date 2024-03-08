"use client"

import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import {
  useAssetReceivedOffers,
  useAssetSentOffers,
} from "@/services/orders/assetOffersService"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { Tabs } from "@/components/ui/Tabs"

import { TabBar } from "./TabBar"
import { AssetsSearchTabContent } from "./tabs-content/AssetsSearchTabContent"
import { BuyOffersTabContent } from "./tabs-content/BuyOffersTabContent"
import { CollectionAssetsSearchTabContent } from "./tabs-content/CollectionAssetsSearchTabContent"
import { SendBuyOffersTabContent } from "./tabs-content/SendBuyOffersTabContent"

export type AccountAssetActivitiesProps = {
  walletAddress: Address
  children?: React.ReactNode
}

const COLLECTION_TAB_PREFIX = "collection-"

export const AccountAssetActivities = ({
  walletAddress,
  children,
}: AccountAssetActivitiesProps) => {
  const receivedOffers = useAssetReceivedOffers({ owner: walletAddress })
  const sentOffers = useAssetSentOffers({ owner: walletAddress })
  const { switchCollection, currentCollectionAddress } =
    useCurrentCollectionContext()

  const defaultValue =
    globalConfig.contractAddresses.length > 1
      ? COLLECTION_TAB_PREFIX + currentCollectionAddress
      : "search-assets"

  const onTabValueChange = (value: string) => {
    if (value.startsWith(COLLECTION_TAB_PREFIX)) {
      switchCollection(value.replace(COLLECTION_TAB_PREFIX, "") as Address)
    }
  }

  return (
    <Tabs
      defaultValue={defaultValue}
      onValueChange={onTabValueChange}
      className="w-full"
    >
      <TabBar
        receivedCounter={receivedOffers.length}
        sentCounter={sentOffers.length}
      />
      {globalConfig.contractAddresses.map((address) => (
        <CollectionAssetsSearchTabContent
          key={address}
          contractAddress={address}
        >
          {children}
        </CollectionAssetsSearchTabContent>
      ))}
      <BuyOffersTabContent offers={receivedOffers} />
      <SendBuyOffersTabContent offers={sentOffers} />
    </Tabs>
  )
}
