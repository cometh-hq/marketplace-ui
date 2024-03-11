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
  const { filtersCounter } = useNFTFilters()

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
          {[...filters.entries()].map(([label, values]) => (
            <FilterMultiCombobox
              key={label}
              label={label}
              values={values.values}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
