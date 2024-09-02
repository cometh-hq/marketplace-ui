"use client"

import { useMemo, useState } from "react"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import { useSearchFilledEvents } from "@/services/cometh-marketplace/searchFilledEventsService"
import { useSearchOrders } from "@/services/cometh-marketplace/searchOrdersService"
import {
  CollectionStandard,
  FilterDirection,
  SearchOrdersRequest,
  SearchOrdersSortOption,
  TradeStatus,
} from "@cometh/marketplace-sdk"
import { ArrowLeftIcon } from "lucide-react"
import { Address } from "viem"

import { TradeActivitiesTable } from "@/components/trade-activities/TradeActivitiesTable"

import { Button } from "../ui/Button"
import { Link } from "../ui/Link"
import { Loading } from "../ui/Loading"
import { ActivitiesFiltersControls } from "./ActivitiesFiltersControls"

type CollectionActivitiesProps = {
  contractAddress: string
}

const NB_COLLECTION_ORDERS_SHOWN = 300

export const CollectionActivities = ({
  contractAddress,
}: CollectionActivitiesProps) => {
  const [filtersOverride, setFiltersOverride] = useState<
    Partial<SearchOrdersRequest>
  >({})

  // Hack until activities have a dedicated endpoint
  const hackedFiltersOverride = useMemo(() => {
    const hackedFiltersOverride = { ...filtersOverride }
    if (hackedFiltersOverride.statuses) {
      hackedFiltersOverride.statuses = hackedFiltersOverride.statuses.filter(
        (status) => status !== TradeStatus.FILLED
      )
    }
    return hackedFiltersOverride
  }, [filtersOverride])

  const { data: orderSearch, isPending: isPendingOrders } = useSearchOrders(
    {
      tokenAddress: contractAddress,
      limit: NB_COLLECTION_ORDERS_SHOWN,
      orderBy: SearchOrdersSortOption.UPDATED_AT,
      orderByDirection: FilterDirection.DESC,
      ...hackedFiltersOverride,
    },
    filtersOverride?.statuses?.includes(TradeStatus.FILLED) &&
      filtersOverride?.statuses?.length === 1
  )

  const { data: filledEventsSearch, isPending: isPendingFilledEvents } =
    useSearchFilledEvents(
      {
        tokenAddress: contractAddress,
        limit: NB_COLLECTION_ORDERS_SHOWN,
        attributes: hackedFiltersOverride.attributes
      },
      !filtersOverride?.statuses?.includes(TradeStatus.FILLED) &&
        filtersOverride?.statuses?.length !== 0
    )
  const { data: collection } = useGetCollection(contractAddress as Address)
  const isPending = isPendingOrders || isPendingFilledEvents
  return (
    <div className="w-full">
      <div className="mb-3">
        <Link href={`/nfts`}>
          <Button variant="secondary" className="gap-1">
            <ArrowLeftIcon size="16" />
            Back to marketplace
          </Button>
        </Link>
      </div>
      <h1 className="mb-2 inline-flex items-center text-2xl font-medium sm:text-3xl">
        Activities for collection{" "}
        <span className="ml-2 font-bold">
          {collection?.name ? <>&quot;{collection?.name}&quot;</> : "..."}
        </span>
      </h1>
      <ActivitiesFiltersControls onFiltersOverrideChange={setFiltersOverride} />
      {isPending ? (
        <div className=" w-full  text-center text-xl">
          Loading collection activities
          <br />
          <Loading />
        </div>
      ) : (
        <>
          <div className="mb-3  font-medium">
            {orderSearch?.total}{" "}
            {orderSearch && orderSearch.total > 1 ? "orders" : "order"} found
          </div>
          <div className="rounded-md border">
            <TradeActivitiesTable
              orders={orderSearch?.orders}
              orderFilledEvents={filledEventsSearch?.filledEvents}
              display1155Columns={
                collection?.standard === CollectionStandard.ERC1155
              }
              maxTransfersToShow={NB_COLLECTION_ORDERS_SHOWN}
              displayAssetColumns={true}
            />
          </div>
        </>
      )}
    </div>
  )
}
