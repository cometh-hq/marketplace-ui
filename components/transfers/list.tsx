"use client"

import React, { useMemo } from "react"
import { AssetTransfer } from "@alembic/nft-api-sdk"
import {
  AssetTransfers,
  Order,
  TradeDirection,
  TradeStatus,
} from "@cometh/marketplace-sdk"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { BigNumber, ethers } from "ethers"
import {
  ArrowLeftRightIcon,
  ArrowRightIcon,
  ExternalLink,
  ImagePlusIcon,
  ShoppingCartIcon,
} from "lucide-react"
import { Address, isAddressEqual } from "viem"

import globalConfig from "@/config/globalConfig"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

import { CopyButton } from "../ui/copy-button"
import { Price } from "../ui/price"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { UserButton } from "../ui/user-button"

dayjs.extend(relativeTime)

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
  <div className="flex text-sm">
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
        activity.order.direction === TradeDirection.BUY ? "Purchase" : "Sale"
    } else {
      label = "Listed"
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

const renderTimestampCell = (activity: AssetActivity) => {
  const activityTimestamp = getActivityTimestamp(activity)
  const dayJsTimestamp = dayjs(activityTimestamp)
  const timeFromNow = dayJsTimestamp.fromNow()
  const readableDate = dayJsTimestamp.format("MMMM D, YYYY [at] h:mm A")

  if (isTransferActivity(activity)) {
    return (
      <TimestampTooltip tooltipContent={readableDate}>
        <a
          href={`${globalConfig.network.explorer?.url}/tx/${activity.transfer.transactionHash}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-end gap-2 text-sm font-medium text-muted-foreground hover:text-secondary-foreground"
        >
          {timeFromNow}
          <ExternalLink size="18" className="" />
        </a>
      </TimestampTooltip>
    )
  } else if (isOrderActivity(activity)) {
    return (
      <TimestampTooltip tooltipContent={readableDate}>
        <div className="text-right text-sm font-medium text-muted-foreground">
          {timeFromNow}
        </div>
      </TimestampTooltip>
    )
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
        </TableCell>

        <TableCell>
          {isOrderActivity(activity) && (
            <Price
              size="sm"
              amount={BigNumber.from(activity.order.erc20TokenAmount)
                .add(activity.order.totalFees)
                .toString()}
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
        <TableCell>{renderTimestampCell(activity)}</TableCell>
      </TableRow>
    )
  })
}

export function TransfersList({
  assetTransfers,
  maxTransfersToShow,
  assetOrders,
}: TransfersListProps) {
  const viewerAddress = useCurrentViewerAddress()
  const assetActivities = useMemo(() => {
    return getAssetActivities(assetTransfers, assetOrders, maxTransfersToShow)
  }, [assetTransfers, assetOrders, maxTransfersToShow])

  return (
    <Table>
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
