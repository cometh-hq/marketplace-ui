"use client"

import { ColumnDef } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"
import { AmountCell } from "@/components/activities/cells/amount"
import { AssetCell } from "@/components/activities/cells/asset"
import { CTACell } from "@/components/activities/cells/cta"
import { DateCell } from "@/components/activities/cells/date"
import { EmitterCell } from "@/components/activities/cells/emitter"

import { CollectionCell } from "../../cells/collection-cell"

export const columns: ColumnDef<BuyOffer>[] = [
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
    accessorKey: "amount",
    header: "Amount",
    cell: AmountCell,
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
