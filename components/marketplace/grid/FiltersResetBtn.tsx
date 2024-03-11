import { XIcon } from "lucide-react"

import { useNFTFilters } from "@/lib/utils/nftFilters"
import { Button } from "@/components/ui/Button"

export const FiltersResetBtn = () => {
  const { reset, filtersCounter } = useNFTFilters()

  return filtersCounter ? (
    <Button
      variant="secondary"
      className="max-md:px-3"
      onClick={reset}
      disabled={filtersCounter === 0}
    >
      <XIcon size="16" className="md:mr-2" />
      <span className="max-md:hidden">Reset filters</span>
    </Button>
  ) : (
    ""
  )
}
