import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useQuery } from "@tanstack/react-query"

import { seedFilters, serializeFilters } from "@/lib/utils/seed"

export function useAttributeFilters() {
  const { currentCollectionAddress } = useCurrentCollectionContext()

  const { data: attributesFilters } = useQuery({
    queryKey: ["attributeFilters", currentCollectionAddress],
    queryFn: async () => {
      const filters = await seedFilters(currentCollectionAddress)
      return serializeFilters(filters)
    },
  })
  return attributesFilters
}
