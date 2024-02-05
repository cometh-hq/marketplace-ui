"use client"

import { AssetsSearchGrid } from "@/components/marketplace/grid/asset-search-grid"
import { useFilters } from "@/services/cometh-marketplace/filters"

export default function MarketplacePage() {
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