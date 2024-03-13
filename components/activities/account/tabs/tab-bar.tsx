import { InboxIcon, SendIcon, WalletIcon } from "lucide-react"

import { TabsList, TabsTrigger } from "../../../ui/tabs"

type TabBarProps = {
  receivedCounter: number
  sentCounter: number
  owner: boolean
}

export const TabBar = ({ owner, receivedCounter, sentCounter }: TabBarProps) => {

  return (
    <TabsList className="mb-4 h-auto gap-x-8 text-xl sm:mb-8">
      <TabsTrigger value="search-assets">
        <WalletIcon size="18" className="mr-2" /> {owner ? "My Collectibles" : "Collectibles"}
      </TabsTrigger>
      <TabsTrigger value="received-offers">
        <InboxIcon size="18" className="mr-2" /> Received Offers <small className="ml-1">(
        {receivedCounter})</small>
      </TabsTrigger>
      <TabsTrigger value="sent-offers">
        <SendIcon size="18" className="mr-2" /> Sent Offers <small className="ml-1">({sentCounter})</small>
      </TabsTrigger>
    </TabsList>
  )
}
