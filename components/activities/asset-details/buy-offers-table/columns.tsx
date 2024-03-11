"use client"

import { ColumnDef } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"
import { AmountCell } from "@/components/activities/cells/AmountCell"
import { CTACell } from "@/components/activities/cells/CancelBuyOfferCell"
import { DateCell } from "@/components/activities/cells/DateCell"
import { EmitterCell } from "@/components/activities/cells/EmitterCell"

export const columns: ColumnDef<BuyOffer>[] = [
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
