"use client"

import { useMemo, useState } from "react"
import { useSearchFilledEvents } from "@/services/cometh-marketplace/searchFilledEventsService"
import { useSearchOrders } from "@/services/cometh-marketplace/searchOrdersService"
import {
  FilterDirection,
  SearchOrdersRequest,
  SearchOrdersSortOption
} from "@cometh/marketplace-sdk"
import { Address } from "viem"
import { TradeActivitiesTable } from "@/components/trade-activities/TradeActivitiesTable"

import { Loading } from "../ui/Loading"
import { TabsContent } from "../ui/Tabs"
import { ActivitiesFiltersControls } from "./ActivitiesFiltersControls"

const NB_COLLECTION_ORDERS_SHOWN = 300

export const AccountActivitiesTab = ({
  walletAddress,
}: {
  walletAddress: Address
}) => {
  const [filtersOverride, setFiltersOverride] = useState<
    Partial<SearchOrdersRequest>
  >({})
  const { data: makerOrdersSearch, isPending: isPendingMakerOrders } =
    useSearchOrders({
      maker: walletAddress,
      limit: NB_COLLECTION_ORDERS_SHOWN,
      orderBy: SearchOrdersSortOption.UPDATED_AT,
      orderByDirection: FilterDirection.DESC,
      ...filtersOverride,
    })
  const { data: takerOrdersSearch, isPending: isPendingTakerOrders } =
    useSearchOrders({
      taker: walletAddress,
      limit: NB_COLLECTION_ORDERS_SHOWN,
      orderBy: SearchOrdersSortOption.UPDATED_AT,
      orderByDirection: FilterDirection.DESC,
      ...filtersOverride,
    })
  const {
    data: takerFilledEventsSearch,
    isPending: isPendingTakerFilledEvents,
  } = useSearchFilledEvents({
    taker: walletAddress,
    limit: NB_COLLECTION_ORDERS_SHOWN,
  })
  const {
    data: makerFilledEventsSearch,
    isPending: isPendingMakerFilledEvents,
  } = useSearchFilledEvents({
    maker: walletAddress,
    limit: NB_COLLECTION_ORDERS_SHOWN,
  })

  const allOrders = useMemo(() => {
    return (makerOrdersSearch?.orders || []).concat(
      takerOrdersSearch?.orders || []
    )
  }, [makerOrdersSearch?.orders, takerOrdersSearch?.orders])

  const allFilledEvents = useMemo(() => {
    return (makerFilledEventsSearch?.filledEvents || []).concat(
      takerFilledEventsSearch?.filledEvents || []
    )
  }, [
    makerFilledEventsSearch?.filledEvents,
    takerFilledEventsSearch?.filledEvents,
  ])

  const isPending =
    isPendingMakerOrders ||
    isPendingTakerOrders ||
    isPendingTakerFilledEvents ||
    isPendingMakerFilledEvents

  return (
    <TabsContent value="account-activities" className="w-full">
      <ActivitiesFiltersControls
        defaultStatuses={[]}
        onFiltersOverrideChange={setFiltersOverride}
      />
      {isPending ? (
        <div className=" w-full  text-center text-xl">
          Loading profile activities
          <br />
          <Loading />
        </div>
      ) : (
        <div className="rounded-md border">
          {
            <TradeActivitiesTable
              orders={allOrders}
              orderFilledEvents={allFilledEvents}
              display1155Columns={true}
              maxTransfersToShow={NB_COLLECTION_ORDERS_SHOWN}
              displayAssetColumns={true}
            />
          }
        </div>
      )}
    </TabsContent>
  )
}
