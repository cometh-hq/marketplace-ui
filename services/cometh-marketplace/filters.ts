import { useEffect, useState } from "react"

import {
  seedFilters,
  SerializedMarketplacePanelFilters,
  serializeFilters,
} from "@/lib/utils/seed"

import { useGetCardsMetadata } from "../cosmik/cards-metadata"

export function useFilters() {
  const [filtersRaw, setFiltersRaw] =
    useState<SerializedMarketplacePanelFilters | null>(null)
  const { cardsMetadata, isLoading: isLoadingCardsMetadata } =
    useGetCardsMetadata()

  useEffect(() => {
    const fetchFilters = async () => {
      let filters = await seedFilters()

      if (!isLoadingCardsMetadata && cardsMetadata) {
        const typeIdWithName = cardsMetadata.reduce((acc, card) => {
          const key = card.typeId.replace("0x", "")
          // @ts-ignore
          acc[key] = `${card.name} ${card.typeId}`
          return acc
        }, {})

        filters.set("type_id_name", {
          values: new Set(Object.values(typeIdWithName)),
        })
      }

      const serializedFilters = serializeFilters(filters)
      setFiltersRaw(serializedFilters)
    }

    fetchFilters()
  }, [cardsMetadata, isLoadingCardsMetadata])

  return { filtersRaw }
}
