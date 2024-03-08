import { useEffect, useState } from "react"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"

import {
  seedFilters,
  SerializedMarketplacePanelFilters,
  serializeFilters,
} from "@/lib/utils/seed"

export function useFilters() {
  const [filtersRaw, setFiltersRaw] =
    useState<SerializedMarketplacePanelFilters | null>(null)
  const { currentCollectionAddress } = useCurrentCollectionContext()

  useEffect(() => {
    const fetchFilters = async () => {
      const filters = await seedFilters(currentCollectionAddress)
      setFiltersRaw(serializeFilters(filters))
    }

    fetchFilters()
  }, [currentCollectionAddress])

  return { filtersRaw }
}
