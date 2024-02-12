"use client"

import { useMemo } from "react"
import { useUsernames } from "@/services/user/use-username"
import { isAddressEqual } from "viem"

import { BuyOffer } from "@/types/buy-offers"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { DataTable } from "@/components/data-table"

import { columns } from "./column"

export type AccountBuyOffersTableProps = {
  offers: BuyOffer[]
}

export function AccountBuyOffersTable({ offers }: AccountBuyOffersTableProps) {
  const viewer = useCurrentViewerAddress()

  const addresses = useMemo(() => {
    return Array.from(
      new Set(
        offers.flatMap((offer) => [offer.emitter.address, offer.owner.address])
      )
    )
  }, [offers])

  const { usernames } = useUsernames(addresses)

  const data = useMemo(() => {
    return offers
      .filter((offer) => {
        if (!viewer) return true
        if (
          isAddressEqual(offer.emitter.address, viewer) &&
          isAddressEqual(offer.owner.address, viewer)
        )
          return false
        return true
      })
      .sort((a, b) => {
        const dateA = new Date(a.date.valueOf())
        const dateB = new Date(b.date.valueOf())
        if (dateA > dateB) return -1
        if (dateA < dateB) return 1
        return 0
      })
      .map((offer) => {
        const emitterUsername = usernames[offer.emitter.address]
        const ownerUsername = usernames[offer.owner.address]

        return {
          ...offer,
          emitter: {
            ...offer.emitter,
            username: emitterUsername,
          },
          owner: {
            ...offer.owner,
            username: ownerUsername,
          },
        }
      })
  }, [offers, viewer, usernames])

  return <DataTable columns={columns} data={data} />
}