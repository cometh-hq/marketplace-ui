import { useMemo } from "react"
import { ChevronDown } from "lucide-react"

import { CardFiltersRaw } from "@/types/assets"
import { useNFTFilters } from "@/lib/utils/nftFilters"
import { Button } from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"

import { CheckboxFilter } from "./CheckboxFilter"

export const FilterMultiCombobox = ({
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
          <CommandInput placeholder="Search..." />
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
