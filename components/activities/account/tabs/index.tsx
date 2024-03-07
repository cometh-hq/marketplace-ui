"use client"

import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import {
  useAssetReceivedOffers,
  useAssetSentOffers,
} from "@/services/orders/asset-buy-offers"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { Tabs } from "../../../ui/tabs"
import { TabBar } from "./tab-bar"
import { AssetsSearchTabContent } from "./tabs-content/assets-search"
import { BuyOffersTabContent } from "./tabs-content/buy-offers"
import { CollectionAssetsSearchTabContent } from "./tabs-content/collection-asset-search"
import { SendBuyOffersTabContent } from "./tabs-content/send-offers"

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
