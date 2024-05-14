import { AssetOwner } from "@cometh/marketplace-sdk"
import { ColumnDef, Row } from "@tanstack/react-table"
import { DateTime } from "luxon"
import { Address } from "viem"

import RelativeDate from "@/components/ui/RelativeDate"
import { UserButton } from "@/components/ui/user/UserButton"

import TokenQuantity from "../TokenQuantity"

export type OwnerCellProps = { row: Row<AssetOwner> }
const OwnerCell = ({ row }: OwnerCellProps) => {
  return <UserButton user={{ address: row.original.owner as Address }} />
}

type AmountCellProps = { row: Row<AssetOwner> }
const QuantityCell = ({ row }: AmountCellProps) => {
  return (
    <span className="font-bold">
      <TokenQuantity value={row.original.quantity} />
    </span>
  )
}

type DateCellProps = { row: Row<AssetOwner> }
const DateCell = ({ row }: DateCellProps) => {
  return (
    <div className="text-muted-foreground font-medium">
      <RelativeDate date={row.original.updatedAt} />
    </div>
  )
}

export const assetOwnerTableColumns: ColumnDef<AssetOwner>[] = [
  {
    accessorKey: "owner",
    header: "Owner",
    cell: OwnerCell,
  },
  {
    accessorKey: "quantity",
    header: "Amount",
    cell: QuantityCell,
  },
  {
    accessorKey: "updatedAt",
    header: "Last update",
    cell: DateCell,
  },
]
