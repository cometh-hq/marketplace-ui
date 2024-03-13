"use client"

import { useFilters } from "@/services/cometh-marketplace/filters"
import { useUsername } from "@/services/user/use-username"
import { ArrowLeftIcon, UserIcon } from "lucide-react"
import { Address } from "viem"

import { shortenAddress } from "@/lib/utils/addresses"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { Link } from "@/components/ui/link"
import { ShareButton } from "@/components/ui/share-button"
import { AccountAssetActivities } from "@/components/activities/account/tabs"
import { AssetsSearchGrid } from "@/components/marketplace/grid/asset-search-grid"

export default function ProfilePage({
  params,
}: {
  params: { address: Address }
}) {
  const { filtersRaw } = useFilters()
  const { username, isFetchingUsername } = useUsername(params.address)

  const user =
    username && !isFetchingUsername
      ? `@${username}`
      : shortenAddress(params.address)

  if (!filtersRaw) {
    return null
  }

  return (
    <div className="container mx-auto flex w-full flex-col items-start gap-4 py-4 max-sm:pt-4">
      <Link href={`/marketplace`}>
        <Button variant="secondary" className="gap-1.5 text-base">
          <ArrowLeftIcon size="16" />
          Back to marketplace
        </Button>
      </Link>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="inline-flex items-center text-2xl font-semibold tracking-tight sm:text-3xl">
            <UserIcon size="28" className="mr-2" />
            Profile {user}
          </h1>
          <CopyButton label="Copy wallet address" size="sm" textToCopy={params.address} />
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
