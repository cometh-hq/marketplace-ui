"use client"

import { Suspense, useEffect } from "react"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { Address } from "viem"

import { CollectionActivities } from "@/components/trade-activities/CollectionActivities"

export default function MarketplaceCollectionActivitiesPage({
  params,
}: {
  params: { contractAddress: Address }
}) {
  const { switchCollection } = useCurrentCollectionContext()
  const contractAddress = params.contractAddress
  useEffect(() => {
    switchCollection(contractAddress)
  }, [contractAddress, switchCollection])

  return (
    <div className="container mx-auto flex items-center justify-center gap-4 py-5 sm:py-6">
      <Suspense>
        <CollectionActivities contractAddress={contractAddress} />
      </Suspense>
    </div>
  )
}
