"use client"

import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { ColumnDef } from "@tanstack/react-table"

import { AssetCell } from "@/components/activities/order-cells/AssetCell"
import { CTACell } from "@/components/activities/order-cells/CancelBuyOfferCell"
import { CollectionCell } from "@/components/activities/order-cells/CollectionCell"
import { DateCell } from "@/components/activities/order-cells/DateCell"
import { EmitterCell } from "@/components/activities/order-cells/EmitterCell"
import { OrderPriceCell } from "@/components/activities/order-cells/OrderPriceCell"

import { OrderProgressCell } from "../../order-cells/OrderProgressCell"
import { QuantityCell } from "../../order-cells/QuantityCell"

export const columns: ColumnDef<OrderWithAsset>[] = [
  {
    accessorKey: "link",
    header: "Collection",
    cell: CollectionCell,
  },
  {
    accessorKey: "link",
    header: "Asset",
    cell: AssetCell,
  },
  {
    accessorKey: "emitter",
    header: "Emitter",
    cell: EmitterCell,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: QuantityCell,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: OrderPriceCell,
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: OrderProgressCell,
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
