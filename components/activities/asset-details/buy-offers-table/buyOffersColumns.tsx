"use client"

import { useMemo } from "react"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { ColumnDef } from "@tanstack/react-table"

import { CTACell } from "@/components/activities/order-cells/CancelBuyOfferCell"
import { DateCell } from "@/components/activities/order-cells/DateCell"
import { EmitterCell } from "@/components/activities/order-cells/EmitterCell"
import { OrderPriceCell } from "@/components/activities/order-cells/OrderPriceCell"

import { OrderProgressCell } from "../../order-cells/OrderProgressCell"
import { QuantityCell } from "../../order-cells/QuantityCell"

const DEFAULT_COLUMNS: ColumnDef<OrderWithAsset>[] = [
  {
    accessorKey: "emitter",
    header: "Emitter",
    cell: EmitterCell,
  },
  {
    accessorKey: "amount",
    header: "Price",
    cell: OrderPriceCell,
  },

  {
    accessorKey: "date",
    header: "Date",
    cell: DateCell,
  },
  {
    accessorKey: "cta",
    header: "",
    cell: CTACell,
  },
]

export const useGetBuyOffersColumns = (
  isErc1155: boolean
): ColumnDef<OrderWithAsset>[] => {
  return useMemo(() => {
    const columns = [...DEFAULT_COLUMNS]
    if (isErc1155) {
      columns.splice(1, 0, {
        accessorKey: "trade.tokenQuantity",
        header: "Quantity",
        cell: QuantityCell,
      })
      columns.splice(3, 0, {
        accessorKey: "progress",
        header: "Progress",
        cell: OrderProgressCell,
      })
    }

    return columns
  }, [isErc1155])
}
