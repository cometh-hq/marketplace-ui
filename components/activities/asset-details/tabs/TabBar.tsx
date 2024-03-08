import { TabsList, TabsTrigger } from "@/components/ui/Tabs"

export const TabBar = () => {
  return (
    <TabsList className="mb-5 h-auto gap-x-5 md:mb-8">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
      <TabsTrigger value="buy-offers">Buy Offers</TabsTrigger>
    </TabsList>
  )
}
