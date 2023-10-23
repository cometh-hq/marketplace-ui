import { useNFTFilters } from "@/lib/utils/nft-filters"

import { Button } from "../../ui/button"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useCurrentViewerAddress } from "@/lib/web3/auth"

export type NFTStateFilterItemProps = {
  label: string
  isOnSale?: boolean
  isSelected?: boolean
}

const NFTStateFilterItem = ({ label, isOnSale, isSelected = false }: NFTStateFilterItemProps) => {
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

export function NFTStateFilters() {
  const { get } = useSearchParams()
  const pathname = usePathname()
  const viewerAddress = useCurrentViewerAddress()

  const isOnProfilePage = pathname.startsWith("/profile")

  return (
    <div className="flex gap-2">
      <NFTStateFilterItem label="All" isSelected={!get('isOnSale')} />
      <NFTStateFilterItem label="On Sale" isOnSale isSelected={Boolean(get('isOnSale'))}  />
      {!isOnProfilePage && viewerAddress && (
        <Link href={`/profile/${viewerAddress}`}>
          <NFTStateFilterItem label="Owned" />
        </Link>
      )}
    </div>
  )
}
