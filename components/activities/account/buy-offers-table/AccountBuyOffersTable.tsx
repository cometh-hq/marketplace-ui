"use client"

import { useMemo } from "react"
import { Address, isAddressEqual } from "viem"
import { useAccount } from "wagmi"

import { BuyOffer } from "@/types/buy-offers"
import { DataTable } from "@/components/DataTable"

import { columns } from "./columns"

export type AccountBuyOffersTableProps = {
  offers: BuyOffer[]
}

export function AccountBuyOffersTable({ offers }: AccountBuyOffersTableProps) {
  const account = useAccount()
  const viewer = account.address

  const data = useMemo(() => {
    return offers
      .sort((a, b) => {
        const dateA = new Date(a.date.valueOf())
        const dateB = new Date(b.date.valueOf())
        if (dateA > dateB) return -1
        if (dateA < dateB) return 1
        return 0
      })
  }, [offers])

  return <DataTable columns={columns} data={data} />
}
