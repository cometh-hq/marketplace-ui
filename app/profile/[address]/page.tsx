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
    <div className="container mx-auto flex w-full flex-col items-start gap-4 py-10">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-end gap-2">
          <h1 className="inline-flex scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl">
            <UserIcon size="34" className="mr-2" />
            User profile ({shortenAddress(params.address)})
          </h1>
          <CopyButton size="lg" textToCopy={params.address} />
        </div>
        <ShareButton textToShow={`Check my assets on`} />
      </div>
      <div className="flex">
        <Link href={`/marketplace`}>
          <Button variant="secondary">
            <ArrowLeftIcon size="16" className="mr-2" />
            Back to marketplace
          </Button>
        </Link>
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
