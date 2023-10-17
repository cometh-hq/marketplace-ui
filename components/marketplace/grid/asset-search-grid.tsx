"use client"

import { useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useFilterableNFTsQuery } from "@/services/alembic/search-assets"
import { AssetSearchFilters } from "@alembic/nft-api-sdk"

import { SerializedMarketplacePanelFilters, deserializeFilters } from "@/lib/utils/seed"

import { AssetCard } from "./asset-card"
import { AssetCardsList } from "./asset-cards-list"
import { MarketplaceFiltersDropdown } from "./filters-dropdown"
import { NFTStateFilters } from "./nft-state-filters"
import { MarketplaceSortDropdown } from "./sort-dropdown"
import { AssetsSearchEmpty } from "./asset-search-empty"
import { Loading } from "@/components/ui/loading"
import { SearchAsset } from "./search-asset"

export type AssetsSearchGridProps = {
  filters: SerializedMarketplacePanelFilters
  filteredBy?: Omit<AssetSearchFilters, "contractAddress">
}

export const AssetsSearchGrid = ({
  filters: filtersRaw,
  filteredBy = {},
}: any) => {
  const { ref: loadMoreRef, inView } = useInView({ threshold: 1 })
  const [search, setSearch] = useState('')

  const filtersDefinition = useMemo(
    () => deserializeFilters(filtersRaw), 
    [filtersRaw]
  )
  const {
    data: nfts,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFilterableNFTsQuery({
    search,
    ...filteredBy,
  })

  const assets = useMemo(() => {
    return (nfts?.pages ?? []).map((r) => r?.nfts.assets).flat()
  }, [nfts?.pages])

  useEffect(() => {
    if (nfts) refetch()
  }, [nfts])

  useEffect(() => {
    if (inView) fetchNextPage()
  }, [inView])

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mb-10 flex flex-wrap gap-4 w-full items-center justify-between">
        <NFTStateFilters />
        <div className="max-md:flex-1 flex items-center gap-x-3">
          <SearchAsset onChange={setSearch} />
          <MarketplaceFiltersDropdown filters={filtersDefinition} />
          <MarketplaceSortDropdown />
        </div>
      </div>

      {isLoading && (
        <Loading />
      )}

      {!isLoading && assets.length === 0 ? (
        <AssetsSearchEmpty />
        ) : (
          <>
            <AssetCardsList>
              {assets.map((asset, index) => (
                <AssetCard key={index} asset={asset} />
              ))}
            </AssetCardsList>
            <div ref={loadMoreRef} className="mt-10">
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
              }
            </div>
          </>
        )
      }
    </div>
  )
}