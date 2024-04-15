import { TabsList, TabsTrigger } from "@/components/ui/Tabs"

export const TabBar = ({ isErc1155 }: { isErc1155: boolean }) => {
  return (
    <TabsList className="mb-5 h-auto md:mb-8">
      <TabsTrigger className="px-3" value="overview">Overview</TabsTrigger>
      <TabsTrigger className="px-3" value="activity">Activity</TabsTrigger>
      <TabsTrigger className="px-3" value="buy-offers">Buy Offers</TabsTrigger>
      {isErc1155 && (
        <TabsTrigger className="px-3" value="asset-owners">Asset owners</TabsTrigger>
      )}
    </TabsList>
  )
}
