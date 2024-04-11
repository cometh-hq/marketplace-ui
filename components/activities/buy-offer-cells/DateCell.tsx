import { Row } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"
import RelativeDate from "@/components/ui/RelativeDate"

export type DateCellProps = {
  row: Row<BuyOffer >
}

export const DateCell = ({ row }: DateCellProps) => {
  return (
    <span className="text-muted-foreground font-medium">
      <RelativeDate date={row.original.date} />
    </span>
  )
}
