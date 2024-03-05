"use client"

import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useFilters } from "@/services/cometh-marketplace/filters"
import { Address } from "viem"

import { AssetsSearchGrid } from "@/components/marketplace/grid/asset-search-grid"

export default function MarketplaceCollectionPage({
  params,
}: {
  params: { contractAddress: Address }
}) {
  const { switchCollection } = useCurrentCollectionContext()
  switchCollection(params.contractAddress)
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
