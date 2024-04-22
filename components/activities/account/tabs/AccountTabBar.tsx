import { useCallback } from "react"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import {
  CalendarIcon,
  InboxIcon,
  ScrollTextIcon,
  SendIcon,
  WalletIcon,
} from "lucide-react"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { useNFTFilters } from "@/lib/utils/nftFilters"
import { TabsList, TabsTrigger } from "@/components/ui/Tabs"

type TabBarProps = {
  receivedCounter: number
  sentCounter: number
}
const COLLECTION_TAB_PREFIX = "collection-"

const CollectionTabsTrigger = ({
  collectionAddress,
}: {
  collectionAddress: Address
}) => {
  const { data: collection } = useGetCollection(collectionAddress)
  const { switchCollection } = useCurrentCollectionContext()
  const { reset } = useNFTFilters()

  const onClickTabsTrigger = useCallback(() => {
    switchCollection(collectionAddress)
    reset()
  }, [collectionAddress, reset, switchCollection])

  return (
    <TabsTrigger
      onClick={onClickTabsTrigger}
      value={COLLECTION_TAB_PREFIX + collectionAddress}
    >
      <WalletIcon size="18" className="mr-2" />{" "}
      {collection ? collection.name : collectionAddress}
    </TabsTrigger>
  )
}

export const AccountTabBar = ({
  receivedCounter,
  sentCounter,
}: TabBarProps) => {
  return (
    <TabsList className="mb-4 h-auto gap-x-6 overflow-x-auto text-xl sm:mb-8">
      {globalConfig.contractAddresses.map((address) => (
        <CollectionTabsTrigger key={address} collectionAddress={address} />
      ))}
      <TabsTrigger value="account-activities">
        <CalendarIcon size="18" className="mr-2" /> Activities
      </TabsTrigger>
      <TabsTrigger value="listings">
        <ScrollTextIcon size="18" className="mr-2" /> Listings{" "}
      </TabsTrigger>
      <TabsTrigger value="received-offers">
        <InboxIcon size="18" className="mr-2" /> Received Offers (
        {receivedCounter})
      </TabsTrigger>
      <TabsTrigger value="sent-offers">
        <SendIcon size="18" className="mr-2" /> Sent Offers ({sentCounter})
      </TabsTrigger>
    </TabsList>
  )
}
