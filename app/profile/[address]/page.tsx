import { Address } from "viem"

import { shortenAddress } from "@/lib/utils/addresses"
import { AssetsSearchGrid } from "@/components/marketplace/grid/asset-search-grid"
import { seedFilters, serializeFilters } from "@/lib/utils/seed"
import { ShareButton } from "@/components/ui/share-button"
import { CopyButton } from "@/components/ui/copy-button"
import { AccountAssetActivities } from "@/components/account-activities/tabs"

export default async function ProfilePage({
  params,
}: {
  params: { address: Address }
}) {
  const filters = await seedFilters()

  return (
    <div className="container mx-auto flex w-full flex-col items-start gap-4 py-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-end gap-2">
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl">
            Profile ({shortenAddress(params.address)})
          </h1>
          <CopyButton size="lg" textToCopy={params.address} />
        </div>
        <ShareButton textToShow={`Check my assets on`} />
      </div>
      <AccountAssetActivities walletAddress={params.address}>
        <AssetsSearchGrid filteredBy={{ owner: params.address }} filters={serializeFilters(filters)} />
      </AccountAssetActivities>
    </div>
  )
}
