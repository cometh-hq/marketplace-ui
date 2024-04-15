"use client"

import { OrderWithAsset } from "@cometh/marketplace-sdk"

import { DataTable } from "@/components/DataTable"

import { columns } from "./columns"

export type AccountBuyOffersTableProps = {
  offers: OrderWithAsset[]
}

export function AccountBuyOffersTable({ offers }: AccountBuyOffersTableProps) {
  return <DataTable columns={columns} data={offers} />
}
