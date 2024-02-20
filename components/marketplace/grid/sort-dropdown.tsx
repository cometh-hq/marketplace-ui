"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { PopoverProps } from "@radix-ui/react-popover"
import { Check, ChevronDown, ListFilter } from "lucide-react"
import { useWindowSize } from "usehooks-ts"

import { useNFTFilters } from "@/lib/utils/nft-filters"
import { cn } from "@/lib/utils/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { FILTERS_SORT } from "../../../config/filters"
import { useGetCardsMetadata } from "@/services/cosmik/cards-metadata"

interface MarketplaceSortDropdownProps extends PopoverProps {}

const DEFAULT_SORT_LABEL = FILTERS_SORT[2].label

export function MarketplaceSortDropdown({
  ...props
}: MarketplaceSortDropdownProps) {
  const [open, setOpen] = useState(false)
  const [currentLabel, setCurrentLabel] = useState(DEFAULT_SORT_LABEL)
  const { get } = useSearchParams()

  const { width } = useWindowSize()
  const isSmallScreen = width && width < 540

  const orderBy = get("orderBy")
  const direction = get("direction")

  // const { cardsMetadata, isLoading } = useGetCardsMetadata()
  // console.log("cardsMetadata", cardsMetadata)

  useEffect(() => {
    const matchingLabel = FILTERS_SORT.find(
      (option) => option.orderBy === orderBy && option.direction === direction
    )?.label
    setCurrentLabel(matchingLabel || DEFAULT_SORT_LABEL)
  }, [get, orderBy, direction])

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size={isSmallScreen ? "icon" : "default"}
          role="combobox"
          aria-label="Load a sort..."
          aria-expanded={open}
          aria-controls="radix-:Rirb9ipj9:"
          className="shrink-0 text-white"
        >
          <ListFilter size="16" className={isSmallScreen ? '' : 'mr-2'} />
          {isSmallScreen ? (
            ""
          ) : (
            <>
              Sort by {currentLabel}
              <ChevronDown size="18" className="ml-2 shrink-0 opacity-70" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[264px] p-0">
        <Command>
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup>
            {FILTERS_SORT.map((filter, index) => (
              <DropdownElement
                key={index}
                setIsOpen={setOpen}
                label={filter.label}
                orderBy={filter.orderBy}
                direction={filter.direction}
              />
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const DropdownElement = ({
  setIsOpen,
  label,
  orderBy,
  direction,
}: {
  setIsOpen: (value: boolean) => void
  label: string
  orderBy?: string
  direction?: string
}) => {
  const { update } = useNFTFilters()
  const { get } = useSearchParams()

  const handleChange = useCallback(() => {
    setIsOpen(false)
    update({
      orderBy,
      direction,
    })
  }, [setIsOpen, update, orderBy, direction])

  const isSelected =
    orderBy === get("orderBy") && direction === get("direction")

  return (
    <CommandItem onSelect={handleChange}>
      {label}
      <Check
        className={cn(
          "ml-auto size-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  )
}
