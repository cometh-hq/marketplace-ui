"use client"

import { ColumnDef } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"

import { AmountCell } from "./cells/amount"
import { CTACell } from "./cells/cta"
import { DateCell } from "./cells/date"
import { EmitterCell } from "./cells/emitter"
import { LinkCell } from "./cells/link"

export const columns: ColumnDef<BuyOffer>[] = [
  {
    accessorKey: "link",
    header: "Asset",
    cell: LinkCell,
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
