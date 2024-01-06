import { ArrowLeftIcon, UserIcon } from "lucide-react"
import { Address } from "viem"

import { shortenAddress } from "@/lib/utils/addresses"
import { seedFilters, serializeFilters } from "@/lib/utils/seed"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { Link } from "@/components/ui/link"
import { ShareButton } from "@/components/ui/share-button"
import { AccountAssetActivities } from "@/components/activities/account/tabs"
import { AssetsSearchGrid } from "@/components/marketplace/grid/asset-search-grid"

export default async function ProfilePage({
  params,
}: {
  params: { address: Address }
}) {
  const filters = await seedFilters()

  return (
    <div className="container mx-auto flex w-full flex-col items-start gap-4 py-10 max-sm:pt-4">
      <Link href={`/marketplace`}>
        <Button variant="secondary" className="gap-1">
          <ArrowLeftIcon size="16" />
          Back to marketplace
        </Button>
      </Link>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="inline-flex items-center text-2xl font-bold tracking-tight sm:text-3xl">
            <UserIcon size="28" className="mr-2" />
            User profile ({shortenAddress(params.address)})
          </h1>
          <CopyButton size="lg" textToCopy={params.address} />
        </div>
        <ShareButton textToShow={`Check my assets on`} />
      </div>
      <AccountAssetActivities walletAddress={params.address}>
        <AssetsSearchGrid
          filteredBy={{ owner: params.address }}
          filters={serializeFilters(filters)}
        />
      </AccountAssetActivities>
    </div>
  )
}
