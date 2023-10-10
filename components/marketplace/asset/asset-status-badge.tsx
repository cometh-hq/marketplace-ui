import { ComponentProps } from "react"

import { AssetStatus } from "@/types/assets"
import { Badge } from "@/components/ui/badge"

const colors: Record<AssetStatus, ComponentProps<typeof Badge>["variant"]> = {
  listed: "pending",
  "not-listed": "background",
  auction: "pending",
  bought: "success",
} as const

const content: Record<AssetStatus, string> = {
  listed: "Listed",
  "not-listed": "Not Listed",
  auction: "Auction",
  bought: "Bought",
} as const

export type AssetStatusBadgeProps = {
  status: AssetStatus
}

export function AssetStatusBadge({ status }: AssetStatusBadgeProps) {
  return <Badge size="xs" variant={colors[status]}>{content[status]}</Badge>
}
