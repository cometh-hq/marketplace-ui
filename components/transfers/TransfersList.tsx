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
  ImagePlusIcon,
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

import TokenQuantity from "../erc1155/TokenQuantity"
import { CopyButton } from "../ui/CopyButton"
import { Price } from "../ui/Price"
import { UserButton } from "../ui/user/UserButton"
import {
  getActivityEmitter,
  getActivityId,
  getActivityReceiver,
  getActivityTimestamp,
  getAssetActivities,
  isOrderActivity,
  isTransferActivity,
} from "./activityHelper"
import { ActivityTimestampCell } from "./ActivityTimestampCell"
import { AssetActivity, ORDER_TYPE, TRANSFER_TYPE } from "./AssetActivityTypes"

type TransfersListProps = {
  assetTransfers: AssetTransfers
  maxTransfersToShow?: number
  assetOrders: Order[]
  display1155Columns: boolean
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

    if (activity.order.orderStatus === TradeStatus.FILLED) {
      label =
        activity.order.direction === TradeDirection.BUY ? "Filled purchase" : "Sale"
    } else {
      label =
        activity.order.direction === TradeDirection.BUY
          ? "Opened offer"
          : "Listed"
    }

    return <GenericActivityEventCell Icon={ShoppingCartIcon} label={label} />
  }
}

const ActivityRow = ({
  activity,
  display1155Columns,
}: {
  activity: AssetActivity
  display1155Columns: boolean
}) => {
  const account = useAccount()
  const viewerAddress = account.address

  const activityEmitter = useMemo(
    () => getActivityEmitter(activity, viewerAddress),
    [activity, viewerAddress]
  )
  const activityReceiver = useMemo(
    () => getActivityReceiver(activity, viewerAddress),
    [activity, viewerAddress]
  )
  const shouldHideReceiver = useMemo(
    () =>
      isOrderActivity(activity) &&
      (activity.order.orderStatus === TradeStatus.OPEN ||
        activity.order.tokenType === TokenType.ERC1155),
    [activity]
  )

  const isErc1155 = useMemo(() => {
    return (
      (isOrderActivity(activity) &&
        activity.order.tokenType === TokenType.ERC1155) ||
      (isTransferActivity(activity) &&
        activity.transfer.tokenType === TokenType.ERC1155)
    )
  }, [activity])

  return (
    <TableRow>
      <TableCell className="items-center">
        <ActivityEventCell activity={activity} />
        <ActivityTimestampCell activity={activity} />
      </TableCell>
      {display1155Columns && (
        <TableCell className="font-bold">
          {isErc1155 &&
            (isOrderActivity(activity) ? (
              <TokenQuantity value={activity.order.tokenQuantity} />
            ) : (
              <TokenQuantity value={activity.transfer.quantity} />
            ))}
        </TableCell>
      )}
      <TableCell>
        {isOrderActivity(activity) && (
          <Price
            size="sm"
            amount={activity.order.totalPrice}
            className="font-semibold"
          />
        )}
      </TableCell>
      <TableCell className="justify-start">
        <div className="flex items-center gap-2">
          <UserButton user={activityEmitter} />
          <CopyButton textToCopy={activityEmitter.address} />
          {!shouldHideReceiver && (
            <>
              <ArrowRightIcon size={18} />
              <UserButton user={activityReceiver} />
              <CopyButton textToCopy={activityReceiver.address} />
            </>
          )}
        </div>
      </TableCell>
      <TableCell>
        <ActivityTimestampCell activity={activity} />
      </TableCell>
    </TableRow>
  )
}

export function TransfersList({
  assetTransfers,
  maxTransfersToShow,
  assetOrders,
  display1155Columns,
}: TransfersListProps) {
  const assetActivities = useMemo(() => {
    return getAssetActivities(assetTransfers, assetOrders, maxTransfersToShow)
  }, [assetTransfers, assetOrders, maxTransfersToShow])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          {display1155Columns && <TableHead>Quantity</TableHead>}
          <TableHead>Price</TableHead>
          <TableHead className="pl-8">From / To</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assetActivities?.length ? (
          assetActivities.map((activity) => (
            <ActivityRow
              key={getActivityId(activity)}
              activity={activity}
              display1155Columns={display1155Columns}
            />
          ))
        ) : (
          <TableRow>
            <TableCell className="h-24 text-center">
              No transfer found for this asset.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
