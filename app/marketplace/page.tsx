"use client"

import { redirect } from "next/navigation"
import { useFilters } from "@/services/cometh-marketplace/filtersService"

import globalConfig from "@/config/globalConfig"
import { AssetsSearchGrid } from "@/components/marketplace/grid/AssetSearchGrid"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"

export default function MarketplacePage() {
  const { currentCollectionAddress } = useCurrentCollectionContext()
  if (globalConfig.contractAddresses.length > 1) {
    redirect("/marketplace/" + currentCollectionAddress)
  }

  const { filtersRaw } = useFilters()

  if (!filtersRaw) {
    return null
  }

  return (
    <div className="container mx-auto flex items-center justify-center gap-4 py-5 sm:py-6">
      <AssetsSearchGrid filters={filtersRaw} />
    </div>
  )
}
