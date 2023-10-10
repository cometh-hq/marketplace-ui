import { DateTime } from "luxon"

export const timeAgo = (timestamp?: number, stripAgo = true) => {
  if (!timestamp) return null
  const units: Intl.RelativeTimeFormatUnit[] = [
    "year",
    "month",
    "week",
    "day",
    "hour",
    "minute",
    "second",
  ]
  const dateTime = DateTime.fromSeconds(timestamp)
  const diff = dateTime.diffNow().shiftTo(...units)
  const unit = units.find((unit) => diff.get(unit) !== 0) || "second"
  const relativeFormatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  })
  return relativeFormatter
    .format(Math.trunc(diff.as(unit)), unit)
    .replace("ago", stripAgo ? "" : "ago")
}
