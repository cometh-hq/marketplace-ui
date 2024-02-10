import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import cx from "classnames"
import { LayoutGridIcon, TagIcon, UserIcon } from "lucide-react"

import { useNFTFilters } from "@/lib/utils/nft-filters"
import { useCurrentViewerAddress } from "@/lib/web3/auth"

import { Button } from "../../ui/button"

export type NFTStateFilterItemProps = {
  label: string
  isOnSale?: boolean
  isSelected?: boolean
  iconComponent?: React.ReactNode
}

const NFTStateFilterItem = ({
  label,
  isOnSale,
  isSelected = false,
  iconComponent = undefined,
}: NFTStateFilterItemProps) => {
  const { update } = useNFTFilters()
  return (
    <Button
      onClick={() => update({ isOnSale })}
      variant={isSelected ? "default" : "ghost"}
      className={cx("font-semibold", isSelected && "bg-accent-foreground text-accent-foreground")}
    >
      {iconComponent ? iconComponent : ""}
      {label}
    </Button>
  )
}

type NFTStateFiltersProps = {
  assets: any[]
  results: number | null
}

export function NFTStateFilters({ results }: NFTStateFiltersProps) {
  const { get } = useSearchParams()
  const pathname = usePathname()
  const viewerAddress = useCurrentViewerAddress()

  const isOnProfilePage = pathname.includes(`/profile`)

  return (
    <div className="flex gap-5">
      <NFTStateFilterItem
        label={`All items`}
        isSelected={!get("isOnSale")}
        iconComponent={<LayoutGridIcon size="16" className="mr-2" />}
      />
      <NFTStateFilterItem
        label="On sale"
        isOnSale
        isSelected={Boolean(get("isOnSale"))}
        iconComponent={<TagIcon size="16" className="mr-2" />}
      />
      {viewerAddress && !isOnProfilePage && (
        <Link href={`/profile/${viewerAddress}`}>
          <NFTStateFilterItem
            label="My NFTs"
            iconComponent={<UserIcon size="16" className="mr-2" />}
          />
        </Link>
      )}
    </div>
  )
}
