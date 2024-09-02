import React, { useMemo } from "react"
import { DateTime } from "luxon"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip"

type RelativeDateProps = {
  date: string | number | DateTime // ISO string or milliseconds
  children?: React.ReactNode
}

const RelativeDate = ({ date, children }: RelativeDateProps) => {
  const { timeFromNow, readableDate } = useMemo(() => {
    const timestamp =
      typeof date === "string"
        ? DateTime.fromISO(date)
        : date instanceof DateTime
          ? date
          : DateTime.fromMillis(date)

    return {
      timeFromNow: timestamp.setLocale('en-US').toRelative(),
      readableDate: timestamp.setLocale('en-US').toLocaleString(DateTime.DATETIME_FULL),
    }
  }, [date])

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger asChild>
          {children ? <>{children}</> : <span>{timeFromNow}</span>}
        </TooltipTrigger>
        <TooltipContent className="px-4 py-3">
          <span className="font-bold">{readableDate}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default RelativeDate
