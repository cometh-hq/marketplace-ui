"use client"

import { useEffect } from "react"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useFilters } from "@/services/cometh-marketplace/filtersService"
import { Address } from "viem"

import { AssetsSearchGrid } from "@/components/marketplace/grid/AssetSearchGrid"

export default function MarketplaceCollectionPage({
  params,
}: {
  params: { contractAddress: Address }
}) {
  const { switchCollection } = useCurrentCollectionContext()
  useEffect(() => {
    switchCollection(params.contractAddress)
  }, [params.contractAddress, switchCollection])
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
