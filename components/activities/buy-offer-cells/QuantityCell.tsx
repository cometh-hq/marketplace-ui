import { Row } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"
import TokenQuantity from "@/components/erc1155/TokenQuantity"

export type QuantityCellProps = { row: Row<BuyOffer> }

export const QuantityCell = ({ row }: QuantityCellProps) => {
  return (
    <span className="font-bold">
      <TokenQuantity value={row.original.trade.tokenQuantity} />
    </span>
  )
}
