import { InboxIcon, SendIcon, WalletIcon } from "lucide-react"

import { TabsList, TabsTrigger } from "../../../ui/tabs"

type TabBarProps = {
  receivedCounter: number
  sentCounter: number
}

export const TabBar = ({ receivedCounter, sentCounter }: TabBarProps) => {
  return (
    <TabsList className="mb-8 h-auto gap-x-6 text-xl">
      <TabsTrigger value="search-assets">
        <WalletIcon size="18" className="mr-2" /> My NFTs
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
