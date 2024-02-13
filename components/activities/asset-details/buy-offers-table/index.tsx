"use client"

import { useMemo } from "react"
import { Row } from "@tanstack/react-table"
import { BigNumber } from "ethers"
import { Address, isAddressEqual } from "viem"

import { BuyOffer } from "@/types/buy-offers"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { DataTable } from "@/components/data-table"

import { columns } from "./column"

export type BuyOffersTableProps = {
  offers: BuyOffer[]
}

export function BuyOffersTable({ offers }: BuyOffersTableProps) {
  const viewer = useCurrentViewerAddress()

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