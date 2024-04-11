import { TabsList, TabsTrigger } from "@/components/ui/Tabs"

export const TabBar = ({ isErc1155 }: { isErc1155: boolean }) => {
  return (
    <TabsList className="mb-5 h-auto gap-x-5 md:mb-8">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
      <TabsTrigger value="buy-offers">Buy Offers</TabsTrigger>
      {isErc1155 && (
        <TabsTrigger value="asset-owners">Asset owners</TabsTrigger>
      )}
    </TabsList>
  )
}
