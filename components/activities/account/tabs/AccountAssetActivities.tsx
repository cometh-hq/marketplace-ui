"use client"

import { useCallback } from "react"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useUserPurchaseOffers } from "@/services/orders/assetOffersService"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { useNFTFilters } from "@/lib/utils/nftFilters"
import { Tabs } from "@/components/ui/Tabs"
import { AccountActivitiesTab } from "@/components/trade-activities/AccountActivitiesTab"
import { useBuyOffersSearch } from "@/components/trade-activities/activityDataHooks"

import { ListingsTabContent } from "../../order-tables/listings/ListingsTabContent"
import { BuyOffersTabContent } from "../../order-tables/offers/BuyOffersTabContent"
import { AccountTabBar } from "./AccountTabBar"
import { CollectionAssetsSearchTabContent } from "./tabs-content/CollectionAssetsSearchTabContent"

export type AccountAssetActivitiesProps = {
  walletAddress: Address
  children?: React.ReactNode
}

const COLLECTION_TAB_PREFIX = "collection-"

export const AccountAssetActivities = ({
  walletAddress,
  children,
}: AccountAssetActivitiesProps) => {
  const { offers: receivedOffers } = useBuyOffersSearch({
    owner: walletAddress,
    filteredOutMaker: walletAddress,
  })
  const { offers: sentOffers } = useBuyOffersSearch({
    maker: walletAddress,
  })
  const { switchCollection, currentCollectionAddress } =
    useCurrentCollectionContext()
  const { reset } = useNFTFilters()

  const defaultValue = COLLECTION_TAB_PREFIX + currentCollectionAddress

  const onTabValueChange = useCallback(
    (value: string) => {
      if (value.startsWith(COLLECTION_TAB_PREFIX)) {
        switchCollection(value.replace(COLLECTION_TAB_PREFIX, "") as Address)
        reset()
      }
    },
    [reset, switchCollection]
  )

  return (
    <Tabs
      defaultValue={defaultValue}
      onValueChange={onTabValueChange}
      className="w-full"
    >
      <AccountTabBar
        receivedCounter={receivedOffers ? receivedOffers.length : 0}
        sentCounter={sentOffers ? sentOffers.length : 0}
      />
      {globalConfig.contractAddresses.map((address) => (
        <CollectionAssetsSearchTabContent
          key={address}
          contractAddress={address}
        >
          {children}
        </CollectionAssetsSearchTabContent>
      ))}

      <BuyOffersTabContent tabKey="received-offers" owner={walletAddress} />
      <BuyOffersTabContent tabKey="sent-offers" maker={walletAddress} />
      <ListingsTabContent maker={walletAddress} />
      <AccountActivitiesTab walletAddress={walletAddress} />
    </Tabs>
  )
}
