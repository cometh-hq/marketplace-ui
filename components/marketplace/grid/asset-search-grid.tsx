"use client"

import { useEffect, useMemo, useState } from "react"
import { useFilterableNFTsQuery } from "@/services/cometh-marketplace/search-assets"
import { AssetSearchFilters } from "@cometh/marketplace-sdk"
import { useInView } from "react-intersection-observer"

import {
  deserializeFilters,
  SerializedMarketplacePanelFilters,
} from "@/lib/utils/seed"
import { Loading } from "@/components/ui/loading"

import { AssetCard } from "./asset-card"
import { AssetCardsList } from "./asset-cards-list"
import { AssetsSearchEmpty } from "./asset-search-empty"
import { MarketplaceFiltersDropdown } from "./filters-dropdown"
import { FiltersResetBtn } from "./filters-reset-btn"
import { NFTStateFilters } from "./nft-state-filters"
import { SearchAsset } from "./search-asset"
import { MarketplaceSortDropdown } from "./sort-dropdown"

export type AssetsSearchGridProps = {
  filters: SerializedMarketplacePanelFilters
  filteredBy?: Omit<AssetSearchFilters, "contractAddress">
}

export const AssetsSearchGrid = ({
  filters: filtersRaw,
  filteredBy = {},
}: any) => {
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.01,
    rootMargin: "0px 0px 2000px 0px",
  })
  const [search, setSearch] = useState("")
  const [initialResults, setInitialResults] = useState<number | null>(null)

  const filtersDefinition = useMemo(
    () => deserializeFilters(filtersRaw),
    [filtersRaw]
  )
  const {
    data: nfts,
    refetch,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useFilterableNFTsQuery({
    search,
    ...filteredBy,
  })

  const assets = useMemo(() => {
    return (nfts?.pages ?? []).map((r) => r?.nfts.assets).flat()
  }, [nfts?.pages])

  const totalNbAssets = useMemo(() => {
    return nfts?.pages[0]?.total ?? 0
  }, [nfts?.pages])

  useEffect(() => {
    if (totalNbAssets && initialResults === null) {
      setInitialResults(totalNbAssets)
    }
  }, [totalNbAssets, initialResults, setInitialResults])

  useEffect(() => {
    if (inView && !isLoading) fetchNextPage()
  }, [inView, isLoading, fetchNextPage])

  return (
    <div className="flex w-full flex-col sm:items-center justify-center">
      <div className="relative flex w-full flex-wrap items-center justify-between gap-4">
        <NFTStateFilters assets={assets} results={totalNbAssets} />
        <div className="flex max-md:w-full items-center justify-between gap-3">
          <SearchAsset onChange={setSearch} />
          <div className="flex gap-3">
            <MarketplaceFiltersDropdown filters={filtersDefinition} />
            <FiltersResetBtn />
            <MarketplaceSortDropdown />
          </div>
        </div>
      </div>
      <p className="mb-10 mt-3 w-full text-left">
        <strong>
          {totalNbAssets} asset{totalNbAssets > 1 && "s"}
        </strong>{" "}
        matching your search
      </p>

      {isLoading && <Loading />}

      {!isLoading && assets.length === 0 ? (
        <AssetsSearchEmpty />
      ) : (
        <>
          <AssetCardsList>
            {assets.map((asset, index) => (
              <AssetCard key={`${asset.tokenId}-${index}`} asset={asset} />
            ))}
          </AssetCardsList>
          <div ref={loadMoreRef} className="py-10">
            {isFetchingNextPage ? "Loading more NFTs..." : <div></div>}
          </div>
        </>
      )}
    </div>
  )
}
