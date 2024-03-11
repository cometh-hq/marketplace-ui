"use client"

import { useMemo } from "react"
import { Row } from "@tanstack/react-table"
import { BigNumber } from "ethers"
import { Address, isAddressEqual } from "viem"
import { useAccount } from "wagmi"

import { BuyOffer } from "@/types/buy-offers"
import { DataTable } from "@/components/DataTable"

import { columns } from "./columns"

export type BuyOffersTableProps = {
  offers: BuyOffer[]
}

export function BuyOffersTable({ offers }: BuyOffersTableProps) {
  const account = useAccount()
  const viewer = account.address

  const data = useMemo(() => {
    return offers
      .filter((offer) => {
        if (offer.trade.tokenId !== offer.asset?.tokenId) return false
        if (
          viewer &&
          isAddressEqual(offer.emitter.address, viewer) &&
          isAddressEqual(
            (offer.asset?.owner as Address) ?? offer.owner.address,
            viewer
          )
        )
          return false
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
  }, [offers, viewer])

  return <DataTable columns={columns} data={data} />
}
