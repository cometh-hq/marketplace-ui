"use client"

import React, { useMemo } from "react"
import { TradeStatus } from "@cometh/marketplace-sdk"
import { ExternalLink } from "lucide-react"
import { DateTime } from "luxon"

import globalConfig from "@/config/globalConfig"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip"
import {
  getActivityTimestamp,
  isFilledEventActivity,
  isOrderActivity,
  isTransferActivity,
} from "./activityHelper"
import { AssetActivity } from "./AssetActivityTypes"

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

const getTxLink = (txHash: string) =>
  `${globalConfig.network.explorer?.url}/tx/${txHash}`

export function ActivityTimestampCell({
  activity,
}: {
  activity: AssetActivity
}) {
  const { timeFromNow, readableDate } = useMemo(() => {
    const activityTimestamp = getActivityTimestamp(activity)
    const luxonTimestamp = DateTime.fromMillis(activityTimestamp)

    return {
      timeFromNow: luxonTimestamp.setLocale('en-US').toRelative(),
      readableDate: luxonTimestamp.setLocale('en-US').toLocaleString(DateTime.DATETIME_FULL),
    }
  }, [activity])

  const transactionLink = useMemo(() => {
    if (isTransferActivity(activity)) {
      return getTxLink(activity.transfer.transactionHash)
    } else if (isFilledEventActivity(activity)) {
      return getTxLink(activity.filledEvent.txHash)
    } else if (isOrderActivity(activity)) {
      const { order } = activity
      if (order.orderStatus === TradeStatus.OPEN) {
        return order.signedTxHash ? getTxLink(order.signedTxHash) : null
      } else if (order.orderStatus === TradeStatus.CANCELLED) {
        return order.lastCancelledTxHash
          ? getTxLink(order.lastCancelledTxHash)
          : null
      } else if (order.orderStatus === TradeStatus.FILLED) {
        return order.lastFilledTxHash ? getTxLink(order.lastFilledTxHash) : null
      }
    }
    return null
  }, [activity])

  if (transactionLink) {
    return (
      <TimestampTooltip tooltipContent={readableDate}>
        <a
          href={transactionLink}
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
