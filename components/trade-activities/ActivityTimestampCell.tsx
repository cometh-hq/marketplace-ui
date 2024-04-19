"use client"

import React, { useMemo } from "react"
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

export function ActivityTimestampCell({
  activity,
}: {
  activity: AssetActivity
}) {
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
