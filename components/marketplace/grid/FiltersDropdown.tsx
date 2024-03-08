import { useCallback, useMemo } from "react"
import { manifest } from "@/manifests/manifests"
import { CheckIcon, ChevronDown, FilterIcon } from "lucide-react"

import { CardFiltersRaw } from "@/types/assets"
import { useNFTFilters } from "@/lib/utils/nftFilters"
import { MarketplacePanelFilters } from "@/lib/utils/seed"
import { cn } from "@/lib/utils/utils"
import { Button } from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"

import { FiltersBadgeCounter } from "./FiltersBadgeCounter"

export type FilterSwitchLineProps = {
  label: string
  icon: React.ReactNode
  active: boolean
}

export const FilterContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="hover:bg-muted flex h-[50px] w-[300px] items-center justify-between rounded-md px-4">
      {children}
    </div>
  )
}

const FilterLabel = ({ children }: { children: string }) => {
  return (
    <span className="text-uppercase text-primary/80 px-4 text-sm font-semibold">
      {children}
    </span>
  )
}

const FilterMultiCombobox = ({
  label,
  values,
}: {
  label: string
  values: Set<string>
}) => {
  const { filters } = useNFTFilters()

  const checkedCount = useMemo(() => {
    return filters[label]?.length
  }, [filters, label])

  return (
    <Popover>
      <div className="flex w-full flex-col justify-between">
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex justify-between gap-2">
            <span className="text-sm font-medium capitalize">
              {label}
              {checkedCount && (
                <span className="text-primary/80 ml-2 text-xs font-bold">
                  ({checkedCount})
                </span>
              )}
            </span>
            <ChevronDown size={16} />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {[...values]
                .sort((a, b) => a.localeCompare(b))
                .map((value, index) => (
                  <CheckboxFilter
                    key={index}
                    label={value}
                    queryKey={label as keyof CardFiltersRaw}
                    queryValue={value}
                  />
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export const CheckboxFilter = ({
  label,
  queryKey,
  queryValue,
}: {
  label: string
  queryKey: keyof CardFiltersRaw
  queryValue: string
}) => {
  const { filters, update } = useNFTFilters()

  const checked = useMemo(() => {
    return filters[queryKey]?.includes(queryValue)
  }, [filters, queryKey, queryValue])

  const check = useCallback(() => {
    let currentValues = filters[queryKey]
    let newValues = Array.isArray(currentValues)
      ? [...currentValues]
      : currentValues
        ? [currentValues]
        : []

    if (!newValues.includes(queryValue)) {
      newValues.push(queryValue)
    } else {
      newValues = newValues.filter((value) => value !== queryValue)
    }

    update({
      [queryKey]: newValues,
    })
  }, [filters, update, queryKey, queryValue])

  const handleCheck = useCallback(() => check(), [check])

  return (
    <CommandItem onSelect={handleCheck}>
      <span>{label}</span>
      {!!checked && <CheckIcon className={cn("ml-auto size-4")} />}
    </CommandItem>
  )
}

type MarketplaceFiltersDropdownProps = {
  filters: MarketplacePanelFilters
}

export const MarketplaceFiltersDropdown = ({
  filters,
}: MarketplaceFiltersDropdownProps) => {
  const ref = manifest.pages.asset.excludedAttributesInFilters.map(
    (attr: string) => attr.toLowerCase()
  )
  const { reset, filtersCounter } = useNFTFilters()

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
