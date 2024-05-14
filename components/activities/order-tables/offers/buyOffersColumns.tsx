"use client"

import { useMemo } from "react"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { ColumnDef } from "@tanstack/react-table"

import { AssetCell } from "@/components/activities/order-cells/AssetCell"
import { CollectionCell } from "@/components/activities/order-cells/CollectionCell"
import { DateCell } from "@/components/activities/order-cells/DateCell"
import { EmitterCell } from "@/components/activities/order-cells/EmitterCell"
import { OrderPriceCell } from "@/components/activities/order-cells/OrderPriceCell"
import { OrderProgressCell } from "@/components/activities/order-cells/OrderProgressCell"
import { QuantityCell } from "@/components/activities/order-cells/QuantityCell"

import { OfferCTAsCell } from "../../order-cells/OfferCTAsCell"

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
    cell: OfferCTAsCell,
  },
]

export const useGetBuyOffersColumns = (
  isSpecificAsset: boolean,
  isErc1155: boolean
): ColumnDef<OrderWithAsset>[] => {
  return useMemo(() => {
    const columns = [...DEFAULT_COLUMNS]
    let nbExtraColumns = 0
    if (!isSpecificAsset) {
      columns.splice(nbExtraColumns + 0, 0, {
        accessorKey: "collection",
        header: "Collection",
        cell: CollectionCell,
      })
      columns.splice(nbExtraColumns + 1, 0, {
        accessorKey: "asset",
        header: "Asset",
        cell: AssetCell,
      })
      nbExtraColumns += 2
    }

    if (isErc1155) {
      columns.splice(nbExtraColumns + 2, 0, {
        accessorKey: "trade.tokenQuantity",
        header: "Quantity available",
        cell: QuantityCell,
      })
      nbExtraColumns += 1
      if (!isSpecificAsset) {
        columns.splice(nbExtraColumns + 3, 0, {
          accessorKey: "progress",
          header: "Progress",
          cell: OrderProgressCell,
        })
      }
      nbExtraColumns += 1
    }

    return columns
  }, [isErc1155, isSpecificAsset])
}
