import { MarketplacePanelFilters } from "@/lib/utils/seed"

export type FilterSwitchLineProps = {
  label: string
  icon: React.ReactNode
  active: boolean
}

export type FiltersDropdownProps = {
  attributeFilterOptions: MarketplacePanelFilters
}
