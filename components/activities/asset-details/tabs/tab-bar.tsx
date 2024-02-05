import { TabsList, TabsTrigger } from "../../../ui/tabs"

export const TabBar = () => {
  return (
    <TabsList className="mb-8 h-auto gap-x-5">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
      <TabsTrigger value="buy-offers">Buy Offers</TabsTrigger>
    </TabsList>
  )
}
