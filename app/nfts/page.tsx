"use client"

import { redirect } from "next/navigation"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"

export default function MarketplacePage() {
  const { currentCollectionAddress } = useCurrentCollectionContext()
  redirect("/nfts/" + currentCollectionAddress)
}
