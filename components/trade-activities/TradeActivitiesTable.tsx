"use client"

import React, { useMemo } from "react"
import {
  AssetTransfers,
  Order,
  TokenType,
  TradeDirection,
  TradeStatus,
} from "@cometh/marketplace-sdk"
import { BigNumber, ethers } from "ethers"
import {
  ArrowLeftRightIcon,
  ArrowRightIcon,
  BanIcon,
  ImagePlusIcon,
  ScrollTextIcon,
  ShoppingCartIcon,
} from "lucide-react"
import { Address, isAddressEqual } from "viem"
import { useAccount } from "wagmi"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"

import { CopyButton } from "../ui/CopyButton"
import { Price } from "../ui/Price"
import { UserButton } from "../ui/user/UserButton"
import {
  getActivityId,
  getMergedActivities,
  isOrderActivity,
  isTransferActivity,
} from "./activityHelper"
import { ActivityTimestampCell } from "./ActivityTimestampCell"
import { ActivityAssetCell } from "./AssetActivityCell"
import { AssetActivity} from "./AssetActivityTypes"
import { ActivityUsersCell } from "./ActivityUserCell"

type TransfersListProps = {
  assetTransfers?: AssetTransfers
  maxTransfersToShow?: number
  orders?: Order[]
  display1155Columns: boolean
  displayAssetColumns: boolean
}

const GenericActivityEventCell = ({
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

const ActivityEventCell = ({ activity }: { activity: AssetActivity }) => {
  if (isTransferActivity(activity)) {
    if (activity.transfer.fromAddress === ethers.constants.AddressZero) {
      return <GenericActivityEventCell Icon={ImagePlusIcon} label="Mint" />
    } else {
      return (
        <GenericActivityEventCell Icon={ArrowLeftRightIcon} label="Transfer" />
      )
    }
  } else if (isOrderActivity(activity)) {
    let label = ""
    let icon = ScrollTextIcon
    if (activity.order.orderStatus === TradeStatus.FILLED) {
      label =
        activity.order.direction === TradeDirection.BUY
          ? "Filled purchase offer"
          : "Sale"
      icon = ShoppingCartIcon
    } else if (activity.order.orderStatus === TradeStatus.OPEN) {
      label =
        activity.order.direction === TradeDirection.BUY
          ? "Sent purchase offer"
          : "Listed"
    } else if (activity.order.orderStatus === TradeStatus.EXPIRED) {
      label =
        activity.order.direction === TradeDirection.BUY
          ? "Expired purchase offer"
          : "Expired listing"
      icon = BanIcon
    } else {
      label =
        activity.order.direction === TradeDirection.BUY
          ? "Cancelled purchase offer"
          : "Cancelled listing"
      icon = BanIcon
    }

    return <GenericActivityEventCell Icon={icon} label={label} />
  }
}

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
  const account = useAccount()
  const viewerAddress = account.address


  const isErc1155 = useMemo(() => {
    return false
  }, [])

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
          {/* {isErc1155 &&
            (isOrderActivity(activity) ? (
              <TokenQuantity value={activity.order.tokenQuantity} />
            ) : (
              <TokenQuantity value={activity.transfer.quantity} />
            ))} */}
        </TableCell>
      )}
      <TableCell>
        {isOrderActivity(activity) && (
          <Price
            size="sm"
            amount={BigNumber.from(activity.order.erc20TokenAmount)
              .add(activity.order.totalFees)
              .toString()}
            className="font-semibold"
          />
        )}
      </TableCell>
      <TableCell className="justify-start">
        <ActivityUsersCell  activity={activity} />
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
  display1155Columns,
  displayAssetColumns = false,
}: TransfersListProps) {
  const mergedActivities = useMemo(() => {
    return getMergedActivities(assetTransfers, orders, maxTransfersToShow)
  }, [assetTransfers, orders, maxTransfersToShow])

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
