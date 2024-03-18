"use client"

import { Suspense, useEffect } from "react"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useAttributeFilters } from "@/services/cometh-marketplace/filtersService"
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
  const attributesFilters = useAttributeFilters()

  if (!attributesFilters) {
    return null
  }

  return (
    <div className="container mx-auto flex items-center justify-center gap-4 py-5 sm:py-6">
      <Suspense>
        <AssetsSearchGrid filters={attributesFilters} />
      </Suspense>
    </div>
  )
}
