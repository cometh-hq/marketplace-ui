"use client"

import React, { useMemo } from "react"
import {
  AssetTransfers,
  CollectionStandard,
  Order,
  OrderFilledEventWithAsset,
  TokenType,
} from "@cometh/marketplace-sdk"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"

import TokenQuantity from "../erc1155/TokenQuantity"
import { Price } from "../ui/Price"
import { ActivityEventCell } from "./ActivityEventCell"
import {
  getActivityId,
  getMergedActivities,
  isFilledEventActivity,
  isOrderActivity,
  isTransferActivity,
} from "./activityHelper"
import { useActivityCollection, useActivityUnitPrice } from "./activityHooks"
import { ActivityTimestampCell } from "./ActivityTimestampCell"
import { ActivityUsersCell } from "./ActivityUsersCell"
import { ActivityAssetCell } from "./AssetActivityCell"
import { AssetActivity } from "./AssetActivityTypes"

type TransfersListProps = {
  assetTransfers?: AssetTransfers
  maxTransfersToShow?: number
  orders?: Order[]
  orderFilledEvents?: OrderFilledEventWithAsset[]
  display1155Columns: boolean
  displayAssetColumns: boolean
}

export const GenericActivityEventCell = ({
  Icon,
  label,
}: {
  Icon: React.ElementType
  label: string
}) => (
  <div className="flex items-center font-medium">
    <Icon className="mr-2" size={16} />
    {label}
  </div>
)

const ActivityRow = ({
  activity,
  display1155Columns,
  displayAssetColumns,
  rowIndex,
}: {
  activity: AssetActivity
  display1155Columns: boolean
  displayAssetColumns: boolean
  rowIndex: number
}) => {
  const collection = useActivityCollection(activity)
  const activityUnitPrice = useActivityUnitPrice(activity)

  const isErc1155 = useMemo(() => {
    if (isOrderActivity(activity)) {
      return activity.order.tokenType === TokenType.ERC1155
    } else if (isTransferActivity(activity)) {
      return activity.transfer.tokenType === TokenType.ERC1155
    } else if (isFilledEventActivity(activity)) {
      return collection?.standard === CollectionStandard.ERC1155
    }
  }, [activity, collection])

  const transferQuantity = useMemo(() => {
    if (isTransferActivity(activity)) {
      return activity.transfer.quantity
    } else if (isOrderActivity(activity)) {
      return activity.order.tokenQuantity
    } else if (isFilledEventActivity(activity)) {
      return activity.filledEvent.fillAmount
    } else {
      throw new Error("Unknown activity type")
    }
  }, [activity])

  const bgClass = useMemo(
    () => (rowIndex % 2 === 0 ? "bg-muted/30" : ""),
    [rowIndex]
  )

  return (
    <TableRow className={bgClass}>
      <TableCell className="items-center">
        <ActivityEventCell activity={activity} />
      </TableCell>
      {displayAssetColumns && (
        <TableCell className="px-4 py-2">
          <ActivityAssetCell activity={activity} />
        </TableCell>
      )}
      {display1155Columns && (
        <TableCell className="font-bold">
          {isErc1155 ? (
            <TokenQuantity value={transferQuantity} />
          ) : (
            <span className="text-muted-foreground">Unique</span>
          )}
        </TableCell>
      )}
      <TableCell>
        {activityUnitPrice && (
          <Price
            size="sm"
            amount={activityUnitPrice}
            className="font-semibold"
          />
        )}
      </TableCell>
      <TableCell className="justify-start">
        <ActivityUsersCell activity={activity} />
      </TableCell>
      <TableCell>
        <ActivityTimestampCell activity={activity} />
      </TableCell>
    </TableRow>
  )
}

export function TradeActivitiesTable({
  assetTransfers = [],
  maxTransfersToShow,
  orders = [],
  orderFilledEvents = [],
  display1155Columns,
  displayAssetColumns = false,
}: TransfersListProps) {
  const mergedActivities = useMemo(() => {
    return getMergedActivities(
      assetTransfers,
      orders,
      orderFilledEvents,
      maxTransfersToShow
    )
  }, [assetTransfers, orders, orderFilledEvents, maxTransfersToShow])

  return (
    <Table className="rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          {displayAssetColumns && <TableHead>Asset</TableHead>}
          {display1155Columns && <TableHead>Quantity</TableHead>}
          <TableHead>Price</TableHead>
          <TableHead className="pl-8">From / To</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mergedActivities?.length ? (
          mergedActivities.map((activity, index) => (
            <ActivityRow
              key={getActivityId(activity)}
              activity={activity}
              display1155Columns={display1155Columns}
              displayAssetColumns={displayAssetColumns}
              rowIndex={index}
            />
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={99}
              className="h-24 w-full text-center font-bold"
            >
              No activity found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
