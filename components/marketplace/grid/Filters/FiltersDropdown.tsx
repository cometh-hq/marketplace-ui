import { useMemo } from "react"
import { manifest } from "@/manifests/manifests"
import { FilterIcon } from "lucide-react"

import { useNFTFilters } from "@/lib/utils/nftFilters"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

import { FilterLabel } from "./FilterLabel"
import { FilterMultiCombobox } from "./FilterMultiCombobox"
import { FiltersBadgeCounter } from "./FiltersBadgeCounter"
import { FiltersDropdownProps } from "./types"

export const FiltersDropdown = ({ filters }: FiltersDropdownProps) => {
  const ref = manifest.pages.asset.excludedAttributesInFilters.map(
    (attr: string) => attr.toLowerCase()
  )
  const { filtersCounter } = useNFTFilters()

  const filtersCategories = useMemo(() => {
    return [...filters.entries()].filter(([key]) => !ref?.includes(key))
  }, [ref, filters])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id="radix-:R1irb9ipj9:"
          variant="outline"
          className="relative max-md:px-3"
        >
          <FilterIcon size="16" className="md:mr-2" />
          <span className="max-md:hidden">Attributes filters</span>
          <FiltersBadgeCounter counter={filtersCounter} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[250px]">
        <FilterLabel>Attributes</FilterLabel>
        <div className="mt-2 flex flex-col">
          {filtersCategories.map(([k, v]) => (
            <FilterMultiCombobox key={k} label={k} values={v.values} />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
