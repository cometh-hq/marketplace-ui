"use client"
import { ArrowLeftIcon, UserIcon } from "lucide-react"
import { Address } from "viem"

import { shortenAddress } from "@/lib/utils/addresses"

import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { Link } from "@/components/ui/link"
import { ShareButton } from "@/components/ui/share-button"
import { AccountAssetActivities } from "@/components/activities/account/tabs"
import { AssetsSearchGrid } from "@/components/marketplace/grid/asset-search-grid"
import { useFilters } from "@/services/cometh-marketplace/filters"

export default function ProfilePage({
  params,
}: {
  params: { address: Address }
}) {
  const { filtersRaw } = useFilters()

  if (!filtersRaw) {
    return null
  }

  return (
    <div className="container mx-auto flex w-full flex-col items-start gap-4 py-4 max-sm:pt-2">
      <Link href={`/nfts`}>
        <Button variant="secondary" className="gap-1">
          <ArrowLeftIcon size="16" />
          Back to marketplace
        </Button>
      </Link>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="inline-flex items-center text-2xl font-bold tracking-tight sm:text-3xl">
            <UserIcon size="28" className="mr-2 max-sm:hidden" />
            User <span className="max-sm:hidden">profile</span> ({shortenAddress(params.address)})
          </h1>
          <CopyButton size="lg" textToCopy={params.address} />
        </div>
        <ShareButton textToShow={`Check my assets on`} />
      </div>
      <AccountAssetActivities walletAddress={params.address}>
        <AssetsSearchGrid
          filteredBy={{ owner: params.address }}
          filters={filtersRaw}
        />
      </AccountAssetActivities>
    </div>
  )
}
