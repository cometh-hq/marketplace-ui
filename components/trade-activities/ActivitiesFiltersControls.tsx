"use client"

import { useEffect, useMemo, useState } from "react"
import { useAttributeFilters } from "@/services/cometh-marketplace/filtersService"
import { useCurrentAttributesFilters } from "@/services/cometh-marketplace/searchAssetsService"
import { SearchOrdersRequest, TradeStatus } from "@cometh/marketplace-sdk"
import { useQueryClient } from "@tanstack/react-query"
import { useWindowSize } from "usehooks-ts"

import { deserializeFilters, MarketplacePanelFilters } from "@/lib/utils/seed"

import { FiltersDropdown } from "../marketplace/grid/Filters/FiltersDropdown"
import FiltersFullscreen from "../marketplace/grid/Filters/FiltersFullscreen"
import { FiltersResetBtn } from "../marketplace/grid/Filters/FiltersResetBtn"
import { ActivityStatusMultiselect } from "./ActivityStatusMultiselect"

type ActivitiesFiltersControlsProps = {
  onFiltersOverrideChange: (
    filtersOverride: Partial<SearchOrdersRequest>
  ) => void
  defaultStatuses?: TradeStatus[]
}

export const ActivitiesFiltersControls = ({
  onFiltersOverrideChange,
  defaultStatuses = [TradeStatus.OPEN, TradeStatus.FILLED],
}: ActivitiesFiltersControlsProps) => {
  const [selectedStatuses, setSelectedStatuses] =
    useState<TradeStatus[]>(defaultStatuses)

  const currentAttributesFilters = useCurrentAttributesFilters()
  const queryClient = useQueryClient()

  useEffect(() => {
    const filtersOverride: Partial<SearchOrdersRequest> = {
      statuses: selectedStatuses,
    }
    if (currentAttributesFilters && currentAttributesFilters.length) {
      filtersOverride.attributes = currentAttributesFilters
    }
    onFiltersOverrideChange(filtersOverride)
  }, [
    selectedStatuses,
    currentAttributesFilters,
    onFiltersOverrideChange,
    queryClient,
  ])

  const { width } = useWindowSize()
  const isMobile = width < 768

  const attributesFilters = useAttributeFilters()
  const attributeFilterOptions = useMemo(
    () =>
      attributesFilters
        ? deserializeFilters(attributesFilters)
        : ({} as MarketplacePanelFilters),
    [attributesFilters]
  )

  if (!attributesFilters) {
    return null
  }

  return (
    <div className="mb-2 flex flex-wrap gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <label className="text-md font-bold">Order status:</label>
        <ActivityStatusMultiselect
          onValueChange={setSelectedStatuses}
          selectedStatuses={selectedStatuses}
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {isMobile ? (
          <FiltersFullscreen attributeFilterOptions={attributeFilterOptions} />
        ) : (
          <>
            <FiltersDropdown attributeFilterOptions={attributeFilterOptions} />
            <FiltersResetBtn />
          </>
        )}
      </div>
    </div>
  )
}
