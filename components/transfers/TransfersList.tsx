"use client"

import React, { useMemo } from "react"
import {
  AssetTransfer,
  AssetTransfers,
  Order,
  TradeDirection,
  TradeStatus,
} from "@cometh/marketplace-sdk"
import { BigNumber, ethers } from "ethers"
import {
  ArrowLeftRightIcon,
  ArrowRightIcon,
  ExternalLink,
  ImagePlusIcon,
  ShoppingCartIcon,
} from "lucide-react"
import { Address, isAddressEqual } from "viem"
import { useAccount } from "wagmi"

import globalConfig from "@/config/globalConfig"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip"
import { UserButton } from "../ui/user/UserButton"
import { DateTime } from "luxon"


type TransfersListProps = {
  assetTransfers: AssetTransfers
  maxTransfersToShow?: number
  assetOrders: Order[]
}

const TRANSFER_TYPE = "transfer"
const ORDER_TYPE = "order"

type TransferActivity = {
  activityType: "transfer"
  transfer: AssetTransfer
}

type OrderActivity = {
  activityType: "order"
  order: Order
}

type AssetActivity = TransferActivity | OrderActivity

const getUsername = (address: Address, viewerAddress?: Address) => {
  if (viewerAddress && isAddressEqual(address, viewerAddress)) {
    return "You"
  }
}

const isTransferActivity = (
  assetActivity: AssetActivity
): assetActivity is TransferActivity => {
  return assetActivity.activityType === TRANSFER_TYPE
}
const isOrderActivity = (
  assetActivity: AssetActivity
): assetActivity is OrderActivity => {
  return assetActivity.activityType === ORDER_TYPE
}

const getActivityTimestamp = (assetActivity: AssetActivity) => {
  if (isTransferActivity(assetActivity)) {
    return assetActivity.transfer.timestamp
  } else if (isOrderActivity(assetActivity)) {
    const { order } = assetActivity
    let dateToUse = order.signedAt

    if (order.orderStatus === TradeStatus.FILLED) {
      dateToUse = order.filledAt as string
    }
    return new Date(dateToUse).getTime()
  } else {
    throw new Error("Unknown activity type")
  }
}

const getFormattedUser = (userAddress: Address, viewerAddress?: Address) => {
  return {
    username: getUsername(userAddress as Address, viewerAddress),
    address: userAddress,
  }
}

const getActivityEmitter = (
  assetActivity: AssetActivity,
  viewerAddress?: Address
) => {
  if (isTransferActivity(assetActivity)) {
    return getFormattedUser(
      assetActivity.transfer.fromAddress as Address,
      viewerAddress
    )
  } else if (isOrderActivity(assetActivity)) {
    return getFormattedUser(assetActivity.order.maker as Address, viewerAddress)
  } else {
    throw new Error("Unknown activity type")
  }
}

const getActivityReceiver = (
  assetActivity: AssetActivity,
  viewerAddress?: Address
) => {
  if (isTransferActivity(assetActivity)) {
    return getFormattedUser(
      assetActivity.transfer.toAddress as Address,
      viewerAddress
    )
  } else if (isOrderActivity(assetActivity)) {
    return getFormattedUser(assetActivity.order.taker as Address, viewerAddress)
  } else {
    throw new Error("Unknown activity type")
  }
}

const getActivityId = (assetActivity: AssetActivity) => {
  if (isTransferActivity(assetActivity)) {
    return TRANSFER_TYPE + assetActivity.transfer.id
  } else if (isOrderActivity(assetActivity)) {
    return ORDER_TYPE + assetActivity.order.id
  } else {
    throw new Error("Unknown activity type")
  }
}

const getAssetActivities = (
  assetTransfers: AssetTransfers,
  assetOrders: Order[],
  maxActivitiesToShow?: number
): AssetActivity[] => {
  const transferActivites = assetTransfers.map((asset) => ({
    activityType: TRANSFER_TYPE,
    transfer: asset,
  }))
  const orderActivities = assetOrders.map((order) => ({
    activityType: ORDER_TYPE,
    order,
  }))
  const activities = [
    ...transferActivites,
    ...orderActivities,
  ] as AssetActivity[]
  activities.sort((activity1, activity2) => {
    const activity1Timestamp = getActivityTimestamp(activity1)
    const activity2Timestamp = getActivityTimestamp(activity2)

    return activity2Timestamp - activity1Timestamp
  })
  return activities.slice(0, maxActivitiesToShow)
}

const ActivityEventCell = ({
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

const renderActivityEventCell = (activity: AssetActivity) => {
  if (isTransferActivity(activity)) {
    if (activity.transfer.fromAddress === ethers.constants.AddressZero) {
      return <ActivityEventCell Icon={ImagePlusIcon} label="Mint" />
    } else {
      return <ActivityEventCell Icon={ArrowLeftRightIcon} label="Transfer" />
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

    return <ActivityEventCell Icon={ShoppingCartIcon} label={label} />
  }
}
const TimestampTooltip = ({
  children,
  tooltipContent,
}: {
  children: React.ReactNode
  tooltipContent: string
}) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip defaultOpen={false}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="px-4 py-3">
        <span className="font-bold">{tooltipContent}</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

function ActivityTimestampCell({ activity }: { activity: AssetActivity }) {
  const { timeFromNow, readableDate } = useMemo(() => {
    const activityTimestamp = getActivityTimestamp(activity)
    const luxonTimestamp = DateTime.fromMillis(activityTimestamp)

    return {
      timeFromNow: luxonTimestamp.toRelative(),
      readableDate: luxonTimestamp.toLocaleString(DateTime.DATETIME_FULL),
    }
  }, [activity])

  if (isTransferActivity(activity)) {
    return (
      <TimestampTooltip tooltipContent={readableDate}>
        <a
          href={`${globalConfig.network.explorer?.url}/tx/${activity.transfer.transactionHash}`}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-secondary-foreground flex items-center gap-2 text-sm font-medium"
        >
          {timeFromNow}
          <ExternalLink size="18" />
        </a>
      </TimestampTooltip>
    )
  } else if (isOrderActivity(activity)) {
    return (
      <TimestampTooltip tooltipContent={readableDate}>
        <div className="text-muted-foreground text-sm font-medium">
          {timeFromNow}
        </div>
      </TimestampTooltip>
    )
  } else {
    return null // Or return some default UI for other types of activities
  }
}

const renderActivitiesRows = (
  assetActivities: AssetActivity[],
  viewerAddress?: Address
) => {
  return assetActivities.map((activity) => {
    const activityEmitter = getActivityEmitter(activity, viewerAddress)
    const activityReceiver = getActivityReceiver(activity, viewerAddress)
    const isOpenedOrderActivity =
      isOrderActivity(activity) &&
      activity.order.orderStatus === TradeStatus.OPEN

    return (
      <TableRow key={getActivityId(activity)}>
        <TableCell className=" items-center">
          {renderActivityEventCell(activity)}
          <ActivityTimestampCell activity={activity} />
        </TableCell>

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
          <div className="flex items-center gap-2">
            <UserButton user={activityEmitter} />
            <CopyButton textToCopy={activityEmitter.address} />
            {!isOpenedOrderActivity && (
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
  })
}

export function TransfersList({
  assetTransfers,
  maxTransfersToShow,
  assetOrders,
}: TransfersListProps) {
  const account = useAccount()
  const viewerAddress = account.address
  const assetActivities = useMemo(() => {
    return getAssetActivities(assetTransfers, assetOrders, maxTransfersToShow)
  }, [assetTransfers, assetOrders, maxTransfersToShow])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="pl-8">From / To</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assetActivities?.length ? (
          renderActivitiesRows(assetActivities, viewerAddress)
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
