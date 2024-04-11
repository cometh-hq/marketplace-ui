"use client"

import { ColumnDef } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"
import { AmountCell } from "@/components/activities/buy-offer-cells/AmountCell"
import { AssetCell } from "@/components/activities/buy-offer-cells/AssetCell"
import { CTACell } from "@/components/activities/buy-offer-cells/CancelBuyOfferCell"
import { CollectionCell } from "@/components/activities/buy-offer-cells/CollectionCell"
import { DateCell } from "@/components/activities/buy-offer-cells/DateCell"
import { EmitterCell } from "@/components/activities/buy-offer-cells/EmitterCell"

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
