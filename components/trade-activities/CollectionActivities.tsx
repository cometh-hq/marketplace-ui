"use client"

import { useState } from "react"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import { useSearchOrders } from "@/services/cometh-marketplace/searchOrdersService"
import {
  FilterDirection,
  SearchOrdersRequest,
  SearchOrdersSortOption,
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
  const { data: orderSearch, isPending } = useSearchOrders({
    tokenAddress: contractAddress,
    limit: NB_COLLECTION_ORDERS_SHOWN,
    orderBy: SearchOrdersSortOption.UPDATED_AT,
    orderByDirection: FilterDirection.DESC,
    ...filtersOverride,
  })
  const collection = useGetCollection(contractAddress as Address)

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
          {collection?.data?.name ? (
            <>&quot;{collection?.data?.name}&quot;</>
          ) : (
            "..."
          )}
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
              display1155Columns={false}
              maxTransfersToShow={NB_COLLECTION_ORDERS_SHOWN}
              displayAssetColumns={true}
            />
          </div>
        </>
      )}
    </div>
  )
}
