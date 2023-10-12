import { seedFilters, serializeFilters } from "@/lib/utils/seed"
import { AssetsSearchGrid } from "@/components/marketplace/grid/asset-search-grid"

export default async function MarketplacePage() {
  const filters = await seedFilters()

  return (
    <div className="container mx-auto flex items-center justify-center gap-4 py-5 sm:py-10">
      <AssetsSearchGrid filters={serializeFilters(filters)} />
    </div>
  )
}