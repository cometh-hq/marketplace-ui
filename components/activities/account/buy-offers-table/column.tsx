"use client"

import { ColumnDef } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"

import { AmountCell } from "@/components/activities/cells/amount"
import { CTACell } from "@/components/activities/cells/cta"
import { DateCell } from "@/components/activities/cells/date"
import { EmitterCell } from "@/components/activities/cells/emitter"
import { AssetCell } from "@/components/activities/cells/asset"

export const columns: ColumnDef<BuyOffer>[] = [
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
