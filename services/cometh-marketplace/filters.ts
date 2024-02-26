import { useEffect, useState } from "react"
import {
  SerializedMarketplacePanelFilters,
  seedFilters,
  serializeFilters,
} from "@/lib/utils/seed"

export function useFilters() {
  const [filtersRaw, setFiltersRaw] =
    useState<SerializedMarketplacePanelFilters | null>(null)

  useEffect(() => {
    const fetchFilters = async () => {
      const filters = await seedFilters()
      setFiltersRaw(serializeFilters(filters))
    }

    fetchFilters()
  }, [])

  return { filtersRaw }
}