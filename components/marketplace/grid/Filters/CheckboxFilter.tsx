import { useCallback, useMemo } from "react"
import { CheckIcon } from "lucide-react"

import { CardFiltersRaw } from "@/types/assets"
import { useNFTFilters } from "@/lib/utils/nftFilters"
import { cn } from "@/lib/utils/utils"
import {
  CommandItem,
} from "@/components/ui/Command"

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
    <CommandItem
      onSelect={handleCheck}
      className={"max-md:py-2 max-md:text-base"}
    >
      <span>{label}</span>
      {!!checked && <CheckIcon className={cn("ml-auto size-4")} />}
    </CommandItem>
  )
}
