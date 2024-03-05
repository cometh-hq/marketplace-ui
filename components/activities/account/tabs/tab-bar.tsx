import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useGetCollection } from "@/services/cometh-marketplace/collection"
import { InboxIcon, SendIcon, WalletIcon } from "lucide-react"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"

import { TabsList, TabsTrigger } from "../../../ui/tabs"

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
  return (
    <TabsTrigger
      onClick={() => switchCollection(collectionAddress)}
      value={COLLECTION_TAB_PREFIX + collectionAddress}
    >
      <WalletIcon size="18" className="mr-2" />{" "}
      {collection ? collection.name : collectionAddress}
    </TabsTrigger>
  )
}

export const TabBar = ({ receivedCounter, sentCounter }: TabBarProps) => {
  return (
    <TabsList className="mb-4 h-auto gap-x-6 overflow-x-auto text-xl sm:mb-8">
      {globalConfig.contractAddresses.length > 1 ? (
        globalConfig.contractAddresses.map((address) => (
          <CollectionTabsTrigger key={address} collectionAddress={address} />
        ))
      ) : (
        <TabsTrigger value="marketplace">
          <WalletIcon size="18" className="mr-2" /> My NFTs
        </TabsTrigger>
      )}
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
