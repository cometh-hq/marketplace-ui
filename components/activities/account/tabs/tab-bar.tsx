import { TabsList, TabsTrigger } from "../../../ui/tabs"

type TabBarProps = {
  receivedCounter: number
  sentCounter: number
}

export const TabBar = ({
  receivedCounter,
  sentCounter,
}: TabBarProps) => {
  return (
    <TabsList className="mb-8 h-auto gap-x-6">
      <TabsTrigger value="search-assets">Owned</TabsTrigger>
      <TabsTrigger value="received-offers">Received Offers ({receivedCounter})</TabsTrigger>
      <TabsTrigger value="sent-offers">Sent Offers ({sentCounter})</TabsTrigger>
    </TabsList>
  )
}