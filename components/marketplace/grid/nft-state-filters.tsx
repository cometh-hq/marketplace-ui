import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { useNFTFilters } from "@/lib/utils/nft-filters"
import { useCurrentViewerAddress } from "@/lib/web3/auth"

import { Button } from "../../ui/button"

export type NFTStateFilterItemProps = {
  label: string
  isOnSale?: boolean
  isSelected?: boolean
}

const NFTStateFilterItem = ({
  label,
  isOnSale,
  isSelected = false,
}: NFTStateFilterItemProps) => {
  const { update } = useNFTFilters()

  return (
    <Button
      onClick={() => update({ isOnSale })}
      variant={isSelected ? "secondary" : "ghost"}
      className="font-semibold"
    >
      {label}
    </Button>
  )
}

type NFTStateFiltersProps = {
  assets: any[]
  results: number
}

export function NFTStateFilters({ results }: NFTStateFiltersProps) {
  const { get } = useSearchParams()
  const pathname = usePathname()
  const viewerAddress = useCurrentViewerAddress()

  const isOnProfilePage = pathname.includes(
    `${process.env.NEXT_PUBLIC_BASE_PATH}/profile`
  )

  const result = results > 0 ? `(${results})` : ""

  return (
    <div className="flex gap-5">
       <NFTStateFilterItem
        label={`All items ${result}`}
        isSelected={!get("isOnSale")}
      />
      <NFTStateFilterItem
        label="Buy now"
        isOnSale
        isSelected={Boolean(get("isOnSale"))}
      />
      {viewerAddress && !isOnProfilePage && (
        <Link href={`/profile/${viewerAddress}`}>
          <NFTStateFilterItem label="Owned" />
        </Link>
      )}
    </div>
  )
}
