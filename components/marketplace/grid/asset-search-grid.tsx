"use client"

import { useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { manifest } from "@/manifests"
import { useSearchAssets } from "@/services/alembic/search-assets"
import { AssetSearchFilters } from "@alembic/nft-api-sdk"

import { SerializedMarketplacePanelFilters, deserializeFilters } from "@/lib/utils/seed"

import { AssetCard } from "./asset-card"
import { AssetCardsList } from "./asset-cards-list"
import { MarketplaceFiltersDropdown } from "./filters-dropdown"
import { NFTStateFilters } from "./nft-state-filters"
import { MarketplaceSortDropdown } from "./sort-dropdown"
import { AssetsSearchEmpty } from "./asset-search-empty"
import { Loading } from "@/components/ui/loading"
import { useNFTFilters } from "@/lib/utils/nft-filters"
import { SearchAsset } from "./search-asset"

export type AssetsSearchGridProps = {
  filters: SerializedMarketplacePanelFilters
  filteredBy?: Omit<AssetSearchFilters, "contractAddress">
}

export const AssetsSearchGrid = ({
  filters: filtersRaw,
  filteredBy = {},
}: any) => {
  const filtersDefinition = useMemo(
    () => deserializeFilters(filtersRaw), 
    [filtersRaw]
  )
  const { filters } = useNFTFilters()

  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const [searchName, setSearchName] = useState('')

  const search = useSearchAssets({
    filters: {
      contractAddress: manifest.contractAddress,
      name: searchName,
      ...filteredBy,
    },
  })

  const assets = useMemo(
    () => (search.data?.pages ?? []).map((r) => r.assets).flat(),
    [search.data?.pages]
  )

  const { ref: loadMoreRef, inView} = useInView({ threshold: 1 })

  useEffect(() => {
    if (search.data) search.refetch()
  }, [filters])

  useEffect(() => {
    if (inView && !isLoadingMore && search.hasNextPage) {
      setIsLoadingMore(true)
      search.fetchNextPage().then(() => {
        setIsLoadingMore(false)
      });
    }
  }, [inView])

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mb-10 flex flex-wrap gap-4 w-full items-center justify-between">
        <NFTStateFilters />
        <div className="max-md:flex-1 flex items-center gap-x-3">
          <SearchAsset onNameChange={setSearchName} />
          <MarketplaceFiltersDropdown filters={filtersDefinition} />
          <MarketplaceSortDropdown />
        </div>
      </div>

      {search.isLoading && (
        <Loading />
      )}

      {!search.isLoading && assets.length === 0 ? (
        <AssetsSearchEmpty />
        ) : (
          <>
            <AssetCardsList>
              {assets.map((asset, index) => (
                <AssetCard key={index} asset={asset} />
              ))}
            </AssetCardsList>
            <div ref={loadMoreRef} className="mt-10">
              {search.isFetchingNextPage
                ? "Loading more..."
                : search.hasNextPage
              }
            </div>
          </>
        )
      }
    </div>
  )
}