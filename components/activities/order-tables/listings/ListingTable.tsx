"use client"

import { OrderWithAsset } from "@cometh/marketplace-sdk"

import { DataTable } from "@/components/DataTable"

import { useListingColumns } from "./listingTableColumns"

export type ListingTableProps = {
  listings: OrderWithAsset[]
  isSpecificAsset: boolean
  isErc1155: boolean
}

export function ListingTable({
  listings,
  isErc1155,
  isSpecificAsset,
}: ListingTableProps) {
  const columns = useListingColumns(isSpecificAsset, isErc1155)

  return <DataTable columns={columns} data={listings} />
}
