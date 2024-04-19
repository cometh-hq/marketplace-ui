"use client"

import { useMemo } from "react"
import { useSearchOrders } from "@/services/cometh-marketplace/searchOrdersService"
import { FilterDirection, SearchOrdersSortOption, TradeStatus } from "@cometh/marketplace-sdk"
import { Address } from "viem"
import { useAccount } from "wagmi"

import { TradeActivitiesTable } from "@/components/trade-activities/TradeActivitiesTable"

import { Loading } from "../ui/Loading"
import { TabsContent } from "../ui/Tabs"

const NB_COLLECTION_ORDERS_SHOWN = 300

export const AccountActivitiesTab = ({
  walletAddress,
}: {
  walletAddress: Address
}) => {
  const { data: makerOrdersSearch, isPending: isPendingMakerOrders } =
    useSearchOrders({
      maker: walletAddress,
      limit: NB_COLLECTION_ORDERS_SHOWN,
      statuses: [
        TradeStatus.OPEN,
        TradeStatus.FILLED,
        TradeStatus.CANCELLED,
        TradeStatus.EXPIRED,
        TradeStatus.CANCELLED_BY_TRANSFER,
      ],
      orderBy: SearchOrdersSortOption.UPDATED_AT,
      orderByDirection: FilterDirection.DESC,
    })
  const { data: takerOrdersSearch, isPending: isPendingTakerOrders } =
    useSearchOrders({
      taker: walletAddress,
      limit: NB_COLLECTION_ORDERS_SHOWN,
      statuses: [
        TradeStatus.OPEN,
        TradeStatus.FILLED,
        TradeStatus.CANCELLED,
        TradeStatus.EXPIRED,
        TradeStatus.CANCELLED_BY_TRANSFER,
      ],
      orderBy: SearchOrdersSortOption.UPDATED_AT,
      orderByDirection: FilterDirection.DESC,
    })
  const allOrders = useMemo(() => {
    return (makerOrdersSearch?.orders || []).concat(
      takerOrdersSearch?.orders || []
    )
  }, [makerOrdersSearch?.orders, takerOrdersSearch?.orders])
  const isPending = isPendingMakerOrders || isPendingTakerOrders

  return (
    <TabsContent value="account-activities" className="w-full">
      {isPending ? (
        <div className=" w-full  text-center text-xl">
          Loading profile activities
          <br />
          <Loading />
        </div>
      ) : (
        <div className="rounded-md border">
          <TradeActivitiesTable
            orders={allOrders}
            display1155Columns={false}
            maxTransfersToShow={NB_COLLECTION_ORDERS_SHOWN}
            displayAssetColumns={true}
          />
        </div>
      )}
    </TabsContent>
  )
}
