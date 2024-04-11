"use client"

import { useMemo } from "react"
import { BigNumber } from "ethers"
import { BuyOffer } from "@/types/buy-offers"
import { DataTable } from "@/components/DataTable"

import { useGetBuyOffersColumns } from "./buyOffersColumns"

export type BuyOffersTableProps = {
  offers: BuyOffer[]
  isErc1155: boolean
}

export function BuyOffersTable({ offers, isErc1155 }: BuyOffersTableProps) {
  const columns = useGetBuyOffersColumns(isErc1155)

  const data = useMemo(() => {
    return offers
      .filter((offer) => {
        if (offer.trade.tokenId !== offer.asset?.tokenId) return false
        return true
      })
      .sort((a, b) => {
        const [bigA, bigB] = [
          BigNumber.from(a.amount),
          BigNumber.from(b.amount),
        ]
        if (bigA.gt(bigB)) return -1
        if (bigA.lt(bigB)) return 1
        return 0
      })
  }, [offers])

  return <DataTable columns={columns} data={data} />
}
