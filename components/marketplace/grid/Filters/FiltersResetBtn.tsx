import { XIcon } from "lucide-react"

import { useNFTFilters } from "@/lib/utils/nftFilters"
import { Button } from "@/components/ui/Button"

type FiltersResetBtnProps = {
} & React.ComponentProps<typeof Button>

export const FiltersResetBtn = ({
  size,
}: FiltersResetBtnProps) => {
  const { reset, filtersCounter } = useNFTFilters()

  return filtersCounter ? (
    <Button
      variant="secondary"
      size={size}
      className="max-md:w-full max-md:px-3"
      onClick={reset}
      disabled={filtersCounter === 0}
    >
      <XIcon size="16" className="mr-1" />
      Reset filters
    </Button>
  ) : (
    ""
  )
}
