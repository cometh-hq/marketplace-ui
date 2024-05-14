import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { Row } from "@tanstack/react-table"
import { Address } from "viem"

import { UserButton } from "@/components/ui/user/UserButton"

export type EmitterCellProps = { row: Row<OrderWithAsset> }

export const EmitterCell = ({ row }: EmitterCellProps) => {
  return <UserButton user={{ address: row.original.maker as Address }} />
}
