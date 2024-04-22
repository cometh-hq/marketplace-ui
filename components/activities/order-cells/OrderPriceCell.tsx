import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { Row } from "@tanstack/react-table"

import { Price } from "@/components/ui/Price"

export type OrderPriceCellProps = {
  row: Row<OrderWithAsset>
}

export const OrderPriceCell = ({ row }: OrderPriceCellProps) => {
  return (
    <Price
      size="sm"
      amount={row.original.totalUnitPrice}
      className="font-semibold"
    />
  )
}
