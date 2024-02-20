import { XIcon } from "lucide-react"

import { useNFTFilters } from "@/lib/utils/nft-filters"
import { Button } from "@/components/ui/button"

export const FiltersResetBtn = () => {
  const { reset, filtersCounter } = useNFTFilters()

  return filtersCounter ? (
    <Button variant="secondary" className="max-sm:px-3" onClick={reset} disabled={filtersCounter === 0}>
      <XIcon size="16" className="sm:mr-2" />
      <span className="max-sm:hidden">Reset filters</span>
    </Button>
  ) : (
    ""
  )
}
