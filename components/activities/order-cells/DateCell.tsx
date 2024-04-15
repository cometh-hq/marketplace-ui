import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { Row } from "@tanstack/react-table"

import RelativeDate from "@/components/ui/RelativeDate"

export type DateCellProps = {
  row: Row<OrderWithAsset>
}

export const DateCell = ({ row }: DateCellProps) => {
  return (
    <span className="text-muted-foreground font-medium">
      <RelativeDate date={row.original.signedAt} />
    </span>
  )
}
