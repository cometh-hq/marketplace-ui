import { XIcon } from "lucide-react"

import { useNFTFilters } from "@/lib/utils/nft-filters"
import { Button } from "@/components/ui/button"

export const FiltersResetBtn = () => {
  const { reset, filtersCounter } = useNFTFilters()

  return filtersCounter ? (
    <Button variant="secondary" onClick={reset} disabled={filtersCounter === 0}>
      <XIcon size="16"  className="mr-2"/>
      Reset filters 
    </Button>
  ) : ''
}
