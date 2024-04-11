"use client"

import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"
import { AmountCell } from "@/components/activities/buy-offer-cells/AmountCell"
import { CTACell } from "@/components/activities/buy-offer-cells/CancelBuyOfferCell"
import { DateCell } from "@/components/activities/buy-offer-cells/DateCell"
import { EmitterCell } from "@/components/activities/buy-offer-cells/EmitterCell"

import { QuantityCell } from "../../buy-offer-cells/QuantityCell"

const DEFAULT_COLUMNS: ColumnDef<BuyOffer>[] = [
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

export const useGetBuyOffersColumns = (isErc1155: boolean): ColumnDef<BuyOffer>[] => {
  return useMemo(() => {
    const columns = [...DEFAULT_COLUMNS]
    if (isErc1155) {
      columns.splice(1, 0, {
        accessorKey: "trade.tokenQuantity",
        header: "Quantity",
        cell: QuantityCell,
      })
    }

    return columns
  }, [isErc1155])
}
