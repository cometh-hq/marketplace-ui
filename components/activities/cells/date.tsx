import { Row } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"

export type DateCellProps = {
  row: Row<BuyOffer>
}

export const DateCell = ({ row }: DateCellProps) => {
  const formattedDate = row.original.date.toRelative() ?? '-'
  return <span className="font-medium text-muted-foreground">{formattedDate}</span>
}
