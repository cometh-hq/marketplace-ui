"use client"

import { OrderWithAsset } from "@cometh/marketplace-sdk"

import { DataTable } from "@/components/DataTable"

import { useGetBuyOffersColumns } from "./buyOffersColumns"

export type BuyOffersTableProps = {
  offers: OrderWithAsset[]
  isErc1155: boolean
}

export function BuyOffersTable({ offers, isErc1155 }: BuyOffersTableProps) {
  const columns = useGetBuyOffersColumns(isErc1155)



  return <DataTable columns={columns} data={offers} />
}
